/**
 * TransformYupErrorsIntoObject
 *
 * @description Transform the useless yup error into a useable validation object
 * @param {ValidationError} errors Yup validation errors
 * @returns {Record<string, string>} Validation errors
 * by @Vuk
 https://stackoverflow.com/questions/73425133/transform-yup-validation-error-into-a-useable-object
 */
export const transformYupErrorsIntoObject = (
  errors: ValidationError,
): Record<string, string> => {
  const validationErrors: Record<string, string> = {};

  errors.inner.forEach((error: any) => {
    if (error.path !== undefined) {
      validationErrors[error.path] = error.errors[0];
    }
  });

  return validationErrors;
};
