export const procesaErrores = (res, error) => {
    console.log(error);
    res.setHeader('Content-Type','aplication/json')
    return res.status(500).json({
        error: 'error inesperado en el servidor - intente mas tarde',
        detalle : `${error.message}`
    })
    

}