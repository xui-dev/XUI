# دليل صناعة ونشر المكونات على منصة XUI
## How to Build & Publish Components to XUI Registry

هذا الدليل يوضح خطوة بخطوة كيفية إنشاء مكون جديد (Component)، اختباره، ثم رفعه ونشره في مستودع الـ Registry ليظهر تلقائياً في صفحة **Explore Components** ويصبح متاحاً للتحميل عبر الـ CLI.

---

### الطريقة الأولى: عبر لوحة التحكم المرئية (Admin Dashboard) ⚡ (الأسهل والأسرع)

منصة XUI تحتوي على لوحة تحكم مدمجة متطورة تعمل على جهازك المحلي.

#### 1. الدخول إلى اللوحة
- شغّل السيرفر المحلي:
  ```bash
  npm run dev
  ```
- افتح المتصفح على الرابط:
  [http://localhost:3000/admin](http://localhost:3000/admin)

#### 2. ملء بيانات المكون:
1. **Component Slug / ID**: الاسم الفريد للمكون بحروف صغيرة وشرطات (مثال: `cyber-magnetic-button` أو `glowing-card`).
2. **Title**: اسم المكون الظاهر للمستخدمين (مثال: `Cyber Magnetic Button`).
3. **Category**: اختر القسم المناسب (Buttons, Cards, Checkboxes, Loaders, Inputs, Backgrounds...).
4. **Description**: وصف مختصر للمكون ومميزاته الحركية.
5. **Dependencies**: الحزم التي يعتمد عليها المكون مفصولة بفواصل (مثال: `motion, lucide-react, clsx, tailwind-merge`).
6. **Code (TSX / React)**: كود المكون الكامل.

#### 3. المعاينة الحية والتأكد من الكود:
- تحتوي لوحة `/admin` على نافذة **Live Interactive Preview** يمين الشاشة تقوم بتشغيل ومعاينة المكون حياً أثناء كتابتك للكود.

#### 4. الضغط على زر Publish:
- بمجرد الضغط على **Publish to Registry**:
  - يتم إنشاء ملف الكومبوننت تلقائياً في مجلد `registry/`.
  - يتم تحديث فهرس `registry/registry.json`.
  - إذا كان مفتاح `GITHUB_TOKEN` مفعلاً، يتم رفع المكون تلقائياً إلى مستودع GitHub الخارجي (`xui-dev/XUI-components-`).
  - يتم تحديث الكاش التلقائي (`revalidateTag`).

---

### الطريقة الثانية: النشر اليدوي عبر الكود (Manual Workflow) 🛠️

إذا كنت تفضل إنشاء الملفات يدوياً ورفعها عبر Git:

#### 1. إنشاء ملف المكون
ضع ملف الـ React / TypeScript داخل مجلد الـ registry:
`registry/[component-slug].tsx`

**شروط الكود:**
- يجب أن يبدأ بـ `"use client";` في أول سطر إذا كان يستخدم React Hooks أو Framer Motion.
- يجب أن يحتوي على `export default function ComponentName()`.
- استخدم Tailwind CSS للتنسيق.

**مثال (`registry/neon-badge.tsx`):**
```tsx
"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export default function NeonBadge({ text = "Next Gen" }: { text?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
      <Sparkles className="w-3.5 h-3.5" />
      <span>{text}</span>
    </span>
  );
}
```

#### 2. تسجيل المكون في `registry/registry.json`
افتح الملف `registry/registry.json` وأضف بيانات المكون داخل مصفوفة `"items"`:

```json
{
  "name": "neon-badge",
  "title": "Neon Badge",
  "category": "cards",
  "categoryLabel": "Cards",
  "description": "Luminous neon kinetic badge with specular glow.",
  "author": "XUI",
  "authorHandle": "xui",
  "authorAvatar": "/XUI.png",
  "dependencies": ["lucide-react"],
  "files": [
    {
      "name": "neon-badge.tsx",
      "path": "registry/neon-badge.tsx",
      "target": "components/xui/neon-badge.tsx"
    }
  ]
}
```

#### 3. فحص البناء والتشغيل:
```bash
npx tsc --noEmit
npm run build
```

---

### الأقسام المدعومة في XUI حالياً:
| Category ID | الاسم بالعربية |
|---|---|
| `all` | نظرة عامة (Overview) |
| `checkboxes` | مربعات الاختيار |
| `toggle-switches` | مفاتيح التبديل (Switches) |
| `cards` | البطاقات المتفاعلة |
| `loaders` | تأثيرات ومؤشرات التحميل |
| `inputs` | حقول الإدخال |
| `forms` | النماذج والقوائم |
| `patterns` | الخلفيات الشبكية والأنماط |
| `footer` | التذييلات |
| `navbar` | أشرطة التنقل العلوية |
| `background` | الخلفيات الحركية والـ 3D |
| `3d-web-templates` | قوالب المواقع ثلاثية الأبعاد |

---

### نصائح لمعايير الجودة العالية قبل النشر:
1. **Kinetic Physics**: استخدم نوابض فيزيائية طبيعية (`type: "spring", stiffness: 400, damping: 30`) بدلاً من الانتقالات الخطية التقليدية.
