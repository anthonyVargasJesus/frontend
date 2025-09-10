import { Router } from "@angular/router";
import { ErrorManager } from "app/errors/error-manager";
import { Menu } from "app/models/menu";
import { Option } from "app/models/option";
import { UserService } from "app/services/user.service";

export const PAGE_SIZE = 10;
export const DEFAULT_USER_URL = 'assets/images/no-image.png';
export const INIT_PAGE = 1;

export const DEFAULT_WIDTH = 70;

export const CODE_SECURITY_MODULE = 'SECURITY';
export const CODE_CURRENT_STANDARD_MODULE = 'CURRENT_STANDARD';
export const CODE_MANTTO_MODULE = 'MANTTO';
export const CODE_GAP_MODULE = 'GAP';

export function generateNumericId(): number {
  const timestamp = Math.floor(Date.now() / 1000); // segundos (10 dígitos)
  const random = Math.floor(Math.random() * 1000); // 0–999 → 3 dígitos
  return timestamp * 1000 + random; // máx. 13 dígitos
}

export function getReferenceDocsKey(controlEvaluationId: number, requirementEvaluationId: number) {

  let key = 'referenceDocs';
  if (controlEvaluationId != null && controlEvaluationId > 0)
    key = key + '_control_' + controlEvaluationId;
  else
    key = key + '_requirement_' + requirementEvaluationId;

  return key;
}

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
  menu.options.forEach(option => {
    children.push(mapperVuexyToCustomChildren(option));
  });

  let menuVuexy = {
    icon: menu.image,
    id: menu.menuId,
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
