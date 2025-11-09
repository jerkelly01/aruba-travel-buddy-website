// Website Analytics Tracking
// Tracks page views, user interactions, and conversions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class AnalyticsTracker {
  private sessionId: string;
  private currentPage: string = '';

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
  }

  private getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return '';
    
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  private getPageInfo() {
    if (typeof window === 'undefined') {
      return {
        url: '',
        title: '',
        referrer: '',
      };
    }

    return {
      url: window.location.href,
      title: document.title,
      referrer: document.referrer,
    };
  }

  private getDeviceInfo() {
    if (typeof window === 'undefined') {
      return {
        device_type: 'unknown',
        browser: 'unknown',
        os: 'unknown',
      };
    }

    const ua = navigator.userAgent;
    let device_type = 'desktop';
    let browser = 'unknown';
    let os = 'unknown';

    // Device type
    if (/tablet|ipad|playbook|silk/i.test(ua)) {
      device_type = 'tablet';
    } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) {
      device_type = 'mobile';
    }

    // Browser
    if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';
    else if (ua.includes('Opera')) browser = 'Opera';

    // OS
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iOS')) os = 'iOS';

    return { device_type, browser, os };
  }

  private async trackEvent(event: {
    event_type: string;
    event_category?: string;
    event_action?: string;
    event_label?: string;
    event_value?: number;
    conversion_funnel_step?: string;
    conversion_goal?: string;
    custom_properties?: Record<string, any>;
  }) {
    try {
      const pageInfo = this.getPageInfo();
      const deviceInfo = this.getDeviceInfo();

      // Analytics tracking endpoint - use Express API for now (not migrated to Edge Functions yet)
      const trackingUrl = USE_SUPABASE_EDGE_FUNCTIONS
        ? `${EXPRESS_API_URL}/admin/analytics/website/track` // Fallback to Express API for analytics
        : `${API_BASE_URL}/admin/analytics/website/track`;
      
      await fetch(trackingUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: this.sessionId,
          ...event,
          page_url: pageInfo.url, // Backend expects page_url, not url
          page_title: pageInfo.title,
          referrer: pageInfo.referrer,
          ...deviceInfo,
        }),
      });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  // Track page view
  trackPageView(pageUrl?: string, pageTitle?: string) {
    if (typeof window === 'undefined') return;
    
    const url = pageUrl || window.location.href;
    
    // Don't track the same page twice
    if (url === this.currentPage) return;
    this.currentPage = url;

    this.trackEvent({
      event_type: 'page_view',
      event_category: 'navigation',
      event_action: 'page_view',
      event_label: pageTitle || document.title,
      conversion_funnel_step: 'page_view',
    });
  }

  // Track click events
  trackClick(element: string, label?: string) {
    this.trackEvent({
      event_type: 'click',
      event_category: 'engagement',
      event_action: 'click',
      event_label: label || element,
    });
  }

  // Track scroll depth
  trackScroll(depth: number) {
    this.trackEvent({
      event_type: 'scroll',
      event_category: 'engagement',
      event_action: 'scroll',
      event_value: depth,
      conversion_funnel_step: 'scroll',
    });
  }

  // Track form submission
  trackFormSubmit(formName: string) {
    this.trackEvent({
      event_type: 'form_submit',
      event_category: 'conversion',
      event_action: 'form_submit',
      event_label: formName,
      conversion_funnel_step: 'form_submit',
      conversion_goal: formName,
    });
  }

  // Track download
  trackDownload(fileName: string) {
    this.trackEvent({
      event_type: 'download',
      event_category: 'conversion',
      event_action: 'download',
      event_label: fileName,
      conversion_goal: 'download',
    });
  }

  // Track custom event
  trackCustom(eventName: string, properties?: Record<string, any>) {
    this.trackEvent({
      event_type: 'custom',
      event_category: 'custom',
      event_action: eventName,
      custom_properties: properties,
    });
  }
}

// Export singleton instance
export const analytics = new AnalyticsTracker();

// Auto-track page views on route changes (for Next.js)
if (typeof window !== 'undefined') {
  // Track initial page view
  analytics.trackPageView();

  // Track scroll depth
  let maxScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollPercent = Math.round(
      ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
    );
    if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
      maxScroll = scrollPercent;
      analytics.trackScroll(scrollPercent);
    }
  });
}

export default analytics;

