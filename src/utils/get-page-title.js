import defaultSettings from '@/settings'

const title = defaultSettings.title || '流量录制回放'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
