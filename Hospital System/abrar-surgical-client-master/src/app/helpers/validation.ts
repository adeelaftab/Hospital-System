import { empty } from 'rxjs';

export class CustomValidator {
// Validates URL
static urlValidator(url): any {
   if (url.pristine) {
      return null;
   }
   const URL_REGEXP = /^(http?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
   url.markAsTouched();
   if (URL_REGEXP.test(url.value)) {
      return null;
   }
   return {
      invalidUrl: true
   };
}
// Validates passwords
static matchPassword(group): any {
   const password = group.controls.password;
   const confirm = group.controls.confirm;
   if (password.pristine || confirm.pristine) {
      return null;
   }
   group.markAsTouched();
   if (password.value === confirm.value) {
      return null;
   }
   return {
      invalidPassword: true
   };
}
// Validates numbers
static numberValidator(number): any {
  
if(number.value==""){
   return null;
}

   if (number.pristine) {
      return null;
   }
   const NUMBER_REGEXP = /^-?[\d.]+(?:e-?\d+)?$/;
   number.markAsTouched();
   if (NUMBER_REGEXP.test(number.value)) {
      return null;
   }
   return {
      invalidNumber: true
   };
}

// Validates US SSN
static ssnValidator(ssn): any {
   if (ssn.pristine) {
      return null;
   }
   const SSN_REGEXP = /^(?!219-09-9999|078-05-1120)(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4}$/;
   ssn.markAsTouched();
   if (SSN_REGEXP.test(ssn.value)) {
      return null;
   }
   return {
      invalidSsn: true
   };
}
// Validates US phone numbers
static phoneValidator(number): any {
   if (number.pristine) {
      return null;
   }
   const PHONE_REGEXP = /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/;
   number.markAsTouched();
   if (PHONE_REGEXP.test(number.value)) {
      return null;
   }
   return {
      invalidNumber: true
   };
}
// Validates zip codes
static zipCodeValidator(zip): any {
   if (zip.pristine) {
      return null;
   }
   const ZIP_REGEXP = /^[0-9]{5}(?:-[0-9]{4})?$/;
   zip.markAsTouched();
   if (ZIP_REGEXP.test(zip.value)) {
      return null;
   }
   return {
      invalidZip: true
   };
}
}