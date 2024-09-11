import { t } from '@gptx/base/i18n'

/**
 * useDynamicTitle
 */
export function useDynamicTitle (title) {
  let productName = t('common.productName')
  document.title = title + ' - ' + productName
}
