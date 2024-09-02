import { t } from '@gptx/base/i18n'

/**
 * useDynamicTitle
 */
export function useDynamicTitle (title) {
  let productName = window.SITE_TYPE && window.SITE_TYPE === '2'?t('common.productName_Cn'):t('common.productName')
  document.title = title + ' - ' + productName
}
