import * as yup from "yup";

export const contactSchema = yup.object().shape({
    name: yup.string().required(),
    surname: yup.string().required(),
    phone_number: yup.string().required(),
    email: yup.string().email().required(),
    city: yup.string().required(),
    state: yup.string().required(),
    added_date: yup.date().required().default(() => new Date()),
})
