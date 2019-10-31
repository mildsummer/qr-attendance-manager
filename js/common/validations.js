import * as Yup from "yup";

export const VALIDATION_EMAIL = Yup.string().email('メールアドレスの形式で入力してください').required('メールアドレスは必須です');
export const VALIDATION_PASSWORD = Yup.string().min(6, '6文字以上で入力してください').required('パスワードは必須です');
