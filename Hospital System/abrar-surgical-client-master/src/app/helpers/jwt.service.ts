import { JwtHelperService } from '@auth0/angular-jwt';
 
const helper = new JwtHelperService();

function  tokenGetter() {
    return localStorage.getItem('access_token');
}
 
const decodedToken = helper.decodeToken(tokenGetter());
const expirationDate = helper.getTokenExpirationDate(tokenGetter());
const isExpired = helper.isTokenExpired(tokenGetter());