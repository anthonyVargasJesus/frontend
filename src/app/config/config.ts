import { Router } from "@angular/router";
import { ErrorManager } from "app/errors/error-manager";
import { Menu } from "app/models/menu";
import { Option } from "app/models/option";

export const PAGE_SIZE = 10;
export const DEFAULT_USER_URL = 'assets/images/no-image.png';
export const INIT_PAGE = 1;

export function redirectToLogin(router: Router) {
  router.navigate(['/pages/authentication/login-v2']);
}

export function getResultsWithoutPages(total: number) {
  let records = 'registros';
  if (total == 1)
    records = 'registro';
  return total + ' ' + records;
}

export function getResults(total: number, totalPages: number) {
  let records = 'registros';
  let pages = 'páginas';
  if (total == 1)
    records = 'registro';
  if (totalPages == 1)
    pages = 'página';
  return total + ' ' + records + ' en ' + totalPages + ' ' + pages;
}

export function getSearchResults(total: number, totalPages: number, text: string) {
  let records = 'registros encontrados';
  let pages = 'páginas';
  if (total == 1)
    records = 'registro encontrado';
  if (totalPages == 1)
    pages = 'página';
  return total + ' ' + records + " para '" + text + "'";
}

export function getSearchResultsWithoutPages(total: number, text: string) {
  let records = 'registros encontrados';
  if (total == 1)
    records = 'registro encontrado';
  return total + ' ' + records + " para '" + text + "'";
}


export function mapperVuexyToCustom(menu: Menu) {


  let children = [];
  menu.options.forEach( option => {
    children.push(mapperVuexyToCustomChildren(option));
  });

  let menuVuexy = {
    icon: menu.image,
    id: menu._id,
    title: menu.name,
    translate: "MENU.SECURITY",
    type: "collapsible",
    children: children
  }

  return menuVuexy;
}

export function mapperVuexyToCustomChildren(option: Option) {

 let optionVuexy = {
    id: 'user',
    title: option.name,
    translate: 'MENU.USER',
    type: 'item',
    icon: 'circle',
    url: option.url
  };
  return optionVuexy;

}

export function getRandomColor() {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return "#" + randomColor;
}
