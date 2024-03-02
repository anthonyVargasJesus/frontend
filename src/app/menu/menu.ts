import { CoreMenu } from '@core/types'

export const menu: CoreMenu[] = [
  {
    id: 'home',
    title: 'Home',
    translate: 'MENU.HOME',
    type: 'item',
    icon: 'home',
    url: 'home'
  },
  {
    id: 'sample',
    title: 'Sample',
    translate: 'MENU.SAMPLE',
    type: 'item',
    icon: 'file',
    url: 'sample'
  },

  {
    id: 'product-with-router',
    title: 'Product with router',
    translate: 'MENU.PRODUCT_WITH_ROUTER',
    type: 'item',
    icon: 'file',
    url: 'product-with-router'
  },
  {
    id: 'products-by-category',
    title: 'Products by category',
    translate: 'MENU.PRODUCT_BY_CATEGORY',
    type: 'item',
    icon: 'file',
    url: 'products-by-category'
  },
  {
    id: 'purchase-order',
    title: 'Purchase orders',
    translate: 'MENU.PURCHASE_ORDER',
    type: 'item',
    icon: 'file',
    url: 'purchase-order'
  },
  {
    id: 'coin',
    title: 'Coins',
    translate: 'MENU.COIN',
    type: 'item',
    icon: 'file',
    url: 'coin'
  },
  {
    id: 'supplier',
    title: 'Suppliers',
    translate: 'MENU.SUPPLIER',
    type: 'item',
    icon: 'file',
    url: 'supplier'
  },
  {
    id: 'brand',
    title: 'Brands',
    translate: 'MENU.BRAND',
    type: 'item',
    icon: 'file',
    url: 'brand'
  },
  {
    id: 'measurement-unit',
    title: 'Measurement units',
    translate: 'MENU.MEASUREMENT_UNIT',
    type: 'item',
    icon: 'file',
    url: 'measurement-unit'
  },
  {
    id: 'product',
    title: 'Products',
    translate: 'MENU.PRODUCT',
    type: 'item',
    icon: 'file',
    url: 'product'
  },

  {
    id: 'security',
    title: 'Seguridad',
    translate: 'MENU.SECURITY',
    type: 'collapsible',
    icon: 'lock',
    children: [
      {
        id: 'user',
        title: 'Usuarios',
        translate: 'MENU.USER',
        type: 'item',
        icon: 'circle',
        url: 'user'
      },
      {
        id: 'role',
        title: 'Roles',
        translate: 'MENU.ROLE',
        type: 'item',
        icon: 'circle',
        url: 'role'
      },
      {
        id: 'menu',
        title: 'Menus',
        translate: 'MENU.MENU',
        type: 'item',
        icon: 'circle',
        url: 'menu'
      },
      {
        id: 'option',
        title: 'Options',
        translate: 'MENU.OPTION',
        type: 'item',
        icon: 'circle',
        url: 'option'
      },


      
    ]
  },
  
]
