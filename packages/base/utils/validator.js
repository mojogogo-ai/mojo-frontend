import { t } from '@gptx/base/i18n';

// login register
export const validatorPhone = (rule, value, callback) => {
    // const mobile = /^1(3|4|5|6|7|8|9)\d{9}$/ || /^(\+?1)?[2-9]\d{2}[2-9](?!11)\d{6}$/;
    const mobile = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
    if (!value) {
        return callback(new Error(t("login.phoneNumber")));
    }
    if (!mobile.test(value)) {
        return callback(new Error(t("login.phoneNumber")));
    } else {
        callback();
    }
};
export const validatorDigit = (rule, value, callback) => {
    const digit = /^(\d){4}$/;
    if (!value || !digit.test(value)) {
        return callback(new Error(t("login.c")));
    } else {
        callback();
    }
};
export const validatorAgreement = (rule, value, callback) => {
    if (!value) {
        return callback(t('login.e'));
    } else {
        callback();
    }
};
export const validatorEmail = (rule, value, callback) => {
    const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (!value) {
        return callback(new Error(t("login.b")));
    }
    if (!regEmail.test(value)) {
        return callback(new Error(t("login.b")));
    } else {
        callback();
    }
};
export const validatorPassword = (rule, value, callback) => {// Login
    const password = /^(\w|\W){6,20}$/;
    if (!value || !password.test(value)) {
        return callback(new Error(t("login.validPassword")));
    } else {
        callback();
    }
};
export const validatorRegiterPassword = (rule, value, callback) => {// Regiter
    const password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,}$/;
    if (!value || !password.test(value)) {
      return callback(new Error(t("login.validPassword")));
    } else {
      callback();
    }
};