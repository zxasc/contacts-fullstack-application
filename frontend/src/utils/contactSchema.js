import * as yup from "yup";

export const contactSchema = yup.object().shape({
  name: yup.string().required("Imie jest wymagane"),
  surname: yup.string().required("Nazwisko jest wymagane"),
  phone_number: yup
    .string()
    .required("Numer telefonu jest wymagany")
    .matches(
      /^\+?[0-9\s]{0,3}?[0-9]{9}$/,
      "Numer telefonu musi zawierać 9-12 cyfr z opcjonalnym kodem kraju",
    ),
  email: yup
    .string()
    .email("Niewlasciwy format email.")
    .required("Aders email jest wymagany"),
  city: yup.string().required("Miasto jest wymagane"),
});
