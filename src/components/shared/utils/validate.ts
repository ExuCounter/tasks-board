import { string as yupString, object as yupObject } from "yup";

export const baseValidationSchema = yupObject();
export const requiredString = yupString().required("can't be blank");
export const string = yupString();
