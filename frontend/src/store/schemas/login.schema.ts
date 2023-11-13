import * as yup from 'yup'

export const schema = () =>
    yup.object().shape({
        carnet: yup.
            string().
            trim().
            matches(
                /^([A-Z]{2}[0-9]{5})$/i,
                "El carnet debe tener el formato AA#####"
            ).
            required('El carnet es requerido'),
        password: yup.
            string().
            trim().
            min(4, 'La contraseña debe contener al menos 4 caracteres').
            required('La contraseña es requerida'),
    })