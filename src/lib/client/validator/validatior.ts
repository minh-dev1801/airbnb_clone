import { z } from 'zod';
import { isValid, parse } from 'date-fns';

export const createSchemas = (t: (key: string) => string) => ({
  searchSchema: z
    .object({
      location: z.string().min(1, t('requiredLocation')),
      checkIn: z
        .date({ required_error: t('requiredCheckIn') })
        .refine((date) => date >= new Date(), { message: t('invalidCheckIn') }),
      checkOut: z.date({ required_error: t('requiredCheckOut') }),
      guests: z.number().min(1, t('invalidGuests')),
    })
    .superRefine((data, ctx) => {
      if (data.checkIn && data.checkOut && data.checkOut <= data.checkIn) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('invalidCheckOut'),
          path: ['checkOut'],
        });
      }
    }),

  bookingSchema: z
    .object({
      id: z.number(),
      maPhong: z.number(),
      ngayDen: z
        .date({ required_error: t('requiredCheckIn') })
        .refine((date) => date >= new Date(), { message: t('invalidCheckIn') }),
      ngayDi: z.date({ required_error: t('requiredCheckOut') }),
      soLuongKhach: z.number().min(1, t('invalidGuests')),
      maNguoiDung: z.number().min(1, t('requiredUserId')),
    })
    .superRefine((data, ctx) => {
      if (data.ngayDen && data.ngayDi && data.ngayDi <= data.ngayDen) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('invalidCheckOut'),
          path: ['ngayDi'],
        });
      }
    }),

  commentSchema: z.object({
    maPhong: z.number(),
    maNguoiBinhLuan: z.number().min(1, t('requiredCommentUser')),
    ngayBinhLuan: z.date({ required_error: t('invalidCommentDate') }),
    noiDung: z.string().min(1, t('requiredCommentContent')),
    saoBinhLuan: z
      .number()
      .min(1, t('invalidStarRating'))
      .max(5, t('invalidStarRating')),
  }),

  signInSchema: z.object({
    email: z.string().email({ message: t('invalidEmail') }),
    password: z.string().min(1, t('requiredPassword')),
  }),

  signUpSchema: z.object({
    name: z.string().optional(),
    email: z.string().email({ message: t('invalidEmail') }),
    password: z.string().min(6, t('passwordTooShort')),
    phone: z
      .string()
      .optional()
      .refine((val) => !val || (val.length >= 10 && /^[0-9]+$/.test(val)), {
        message: t('invalidPhone'),
      }),
    birthday: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^\d{2}\/\d{2}\/\d{4}$/.test(val),
        t('invalidBirthdayFormat')
      )
      .refine((val) => {
        if (!val) return true;
        const parsed = parse(val, 'dd/MM/yyyy', new Date());
        const today = new Date();
        const minDate = new Date('1900-01-01');
        return isValid(parsed) && parsed <= today && parsed >= minDate;
      }, t('invalidBirthday')),
    gender: z.boolean().optional(),
  }),
});
