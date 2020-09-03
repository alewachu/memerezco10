const TOKEN_KEY='MEMEREZCO10_TOKEN';
export const setToken=(token)=>{
    sessionStorage.setItem(TOKEN_KEY,token);

}

export const getToken=()=>{
    return sessionStorage.getItem(TOKEN_KEY);
}

export const deleteToken=()=>{
    sessionStorage.removeItem(TOKEN_KEY);
}