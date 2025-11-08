import {
  AcademicCapIcon,
  GlobeAltIcon,
  MapPinIcon,
  SunIcon,
  CalendarDaysIcon,
  LanguageIcon,
  SparklesIcon,
  UserGroupIcon,
  CogIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  CheckBadgeIcon,
  CpuChipIcon,
  WifiIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  CheckIcon,
  TrophyIcon,
  HeartIcon,
  ChatBubbleLeftEllipsisIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAmericasIcon,
  BuildingOfficeIcon,
  StarIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  CloudIcon,
  CloudArrowDownIcon,
  CurrencyDollarIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';

export const Icons = {
  // Feature icons
  'sparkles': SparklesIcon,
  'academic-cap': AcademicCapIcon,
  'globe-alt': GlobeAltIcon,
  'map-pin': MapPinIcon,
  'sun': SunIcon,
  'calendar-days': CalendarDaysIcon,
  'language': LanguageIcon,
  'check': CheckIcon,
  'check-circle': CheckCircleIcon,
  'trophy': TrophyIcon,
  'heart': HeartIcon,
  'chat': ChatBubbleLeftEllipsisIcon,

  // About / team icons
  'user-group': UserGroupIcon,
  'building-office': BuildingOfficeIcon,
  'globe-americas': GlobeAmericasIcon,
  'cog': CogIcon,

  // Download icons
  'device-phone-mobile': DevicePhoneMobileIcon,
  'shield-check': ShieldCheckIcon,
  'check-badge': CheckBadgeIcon,
  'cpu-chip': CpuChipIcon,
  'wifi': WifiIcon,
  'star': StarIcon,
  'cloud': CloudIcon,
  'cloud-arrow-down': CloudArrowDownIcon,
  'currency-dollar': CurrencyDollarIcon,
  'bolt': BoltIcon,

  // Footer icons
  'chevron-right': ChevronRightIcon,
  'arrow-right': ArrowRightIcon,
  'information-circle': InformationCircleIcon,
  'question-mark-circle': QuestionMarkCircleIcon,
  'envelope': EnvelopeIcon,
  'phone': PhoneIcon,
};

export type IconName = keyof typeof Icons;
export const ICON_NAMES = Object.keys(Icons) as IconName[];

type Props = {
  name: IconName;
  className?: string;
};

export default function Icon({ name, className = 'w-6 h-6' }: Props) {
  const IconComponent = Icons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <IconComponent className={className} />;
}
