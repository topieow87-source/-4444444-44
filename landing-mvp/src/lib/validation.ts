import { z } from "zod";

export const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const productSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z
    .string()
    .min(2)
    .max(200)
    .regex(slugRegex, "slug: только латиница, цифры и дефис")
    .optional(),
  description: z.string().min(5).max(5000),
  price: z.coerce.number().positive(),
  oldPrice: z.coerce.number().positive().optional().nullable(),
  discount: z.coerce.number().int().min(0).max(99).optional().nullable(),
  images: z.array(z.string().url()).min(1),
  characteristics: z
    .array(z.object({ label: z.string().min(1).max(80), value: z.string().min(1).max(200) }))
    .optional()
    .nullable(),
  stock: z.coerce.number().int().min(0).optional().nullable(),
  isHit: z.boolean().optional().default(false),
  categoryId: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.coerce.number().int().optional().default(0),
});

export const deliveryMethodEnum = z.enum(["NOVA_POSHTA", "UKRPOSHTA", "PICKUP"]);
export const paymentMethodEnum = z.enum(["COD", "CARD"]);
export const orderStatusEnum = z.enum(["NEW", "CONFIRMED", "SHIPPED", "DONE", "CANCELLED"]);

export const orderRequestSchema = z
  .object({
    name: z.string().min(2, "Введите имя").max(100),
    phone: z
      .string()
      .min(7, "Введите корректный номер телефона")
      .max(20)
      .regex(/^[0-9+\-\s()]+$/, "Некорректный формат телефона"),
    city: z.string().max(120).optional().nullable(),
    region: z.string().max(120).optional().nullable(),
    deliveryMethod: deliveryMethodEnum.optional().nullable(),
    warehouse: z.string().max(120).optional().nullable(),
    paymentMethod: paymentMethodEnum.optional().nullable(),
    comment: z.string().max(2000).optional().nullable(),
    productId: z.string().optional().nullable(),
    productTitle: z.string().max(200).optional().nullable(),
    isQuick: z.boolean().optional().default(false),
  })
  .superRefine((data, ctx) => {
    // Полный заказ (не быстрый) требует город, область, способ доставки и оплаты
    if (!data.isQuick) {
      if (!data.city) ctx.addIssue({ code: "custom", path: ["city"], message: "Укажите город" });
      if (!data.region) ctx.addIssue({ code: "custom", path: ["region"], message: "Укажите область" });
      if (!data.deliveryMethod)
        ctx.addIssue({ code: "custom", path: ["deliveryMethod"], message: "Выберите способ доставки" });
      if (!data.paymentMethod)
        ctx.addIssue({ code: "custom", path: ["paymentMethod"], message: "Выберите способ оплаты" });
      if (data.deliveryMethod && data.deliveryMethod !== "PICKUP" && !data.warehouse) {
        ctx.addIssue({
          code: "custom",
          path: ["warehouse"],
          message: "Укажите отделение или индекс",
        });
      }
    }
  });

export const reviewSchema = z.object({
  authorName: z.string().min(2).max(100),
  rating: z.coerce.number().int().min(1).max(5),
  text: z.string().min(5).max(2000),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const categorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "slug: только латиница, цифры и дефис"),
});

export const settingsUpdateSchema = z.record(z.string(), z.string());
