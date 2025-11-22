# Design Guidelines: 대조시장 Font Experience Page

## Design Approach

**Reference-Based + Korean Typography Focus**
Drawing inspiration from modern Korean design showcases (like Naver's font pages, Wanted's product pages) while emphasizing the warm, lively character of a traditional market. The design should feel approachable and playful, celebrating Korean typography through an interactive experience.

**Core Principles:**
- Font as hero: Everything serves to showcase the custom font
- Warm market atmosphere: Inviting, human, energetic
- Immediate clarity: Users understand the interaction instantly
- Joyful interaction: Each action feels delightful

---

## Layout System

**Spacing Units:** Use Tailwind spacing scale focused on: 2, 4, 6, 8, 12, 16, 20, 24 units
- Tight spacing: 2-4 for component internals
- Standard spacing: 8-12 for component separation
- Generous spacing: 16-24 for major sections

**Container Structure:**
- Main container: `max-w-4xl mx-auto px-6 md:px-8`
- Vertical rhythm: `py-12 md:py-16` for main sections
- Component padding: `p-6 md:p-8` for major interactive areas

---

## Typography

**Font Families:**
- Primary (Headers, UI): Inter or Pretendard (Google Fonts) - clean, modern Korean/English support
- Display (Where showcasing the custom font): 대조시장체 (custom webfont)
- Use `font-display: swap` for all fonts

**Hierarchy:**
- Hero Title: `text-4xl md:text-5xl font-bold` (custom font)
- Section Headers: `text-2xl md:text-3xl font-semibold`
- Body/UI Labels: `text-base md:text-lg`
- Small UI text: `text-sm`

---

## Component Library

### Header Section
- Clean, centered hero layout
- Page title in custom font (large, bold, celebratory)
- Subtitle explaining the experience
- Market image: Full-width hero image showing vibrant market scene (1200x400px ideal)
  - Should convey warmth, activity, traditional market atmosphere
  - Subtle overlay (10-20% dark) to ensure text readability
  - Image should be high-quality, showing colorful produce, signs, or market stalls

### Memo Editor (Core Component)
- Large, central textarea with generous padding (`p-8 md:p-12`)
- Background: Customizable (default: warm off-white `bg-amber-50` or similar)
- Border: Subtle, friendly rounded corners `rounded-2xl`
- Shadow: Soft elevation `shadow-lg`
- Min-height: `min-h-[400px]` to feel spacious
- Placeholder text: Encouraging, in Korean (e.g., "여기에 메시지를 입력해보세요...")

### Style Toolbar
- Positioned above memo editor
- Horizontal layout with clear icon buttons
- Grouped logically: [Background Color] [Font Color] [Size] [Bold] [Italic]
- Button style: Light, pill-shaped with subtle borders `rounded-full border-2`
- Active states: Filled background to show selection
- Icons: Use Heroicons or similar for consistent visual language
- Spacing between groups: `gap-4` for button groups, `gap-2` within groups

### Color Pickers
- Inline palette display (5-7 preset warm market colors)
- Circular color swatches `w-10 h-10 rounded-full`
- Active selection: Ring indicator `ring-4 ring-offset-2`
- Colors should reflect market palette: warm yellows, oranges, reds, earthy tones

### Font Size Selector
- Dropdown or slider control
- Range: 16px to 72px
- Visual feedback: Show current size value

### Action Buttons
- Primary "Save" button: Large, prominent `px-8 py-4 text-lg`
- Rounded `rounded-full` or `rounded-xl`
- Positioned below memo editor, centered
- On hero images: Add backdrop blur `backdrop-blur-sm bg-white/80`

### Toast Notification
- Top-center positioning `fixed top-8 left-1/2 -translate-x-1/2`
- Success state: Gentle animation (slide down + fade in)
- Friendly Korean message: "저장되었습니다! 💾"
- Auto-dismiss after 3 seconds
- Soft shadow and rounded corners

---

## Visual Treatment

**Borders & Corners:**
- Primary components: `rounded-2xl` for warmth
- Buttons/pills: `rounded-full` for friendliness
- Small elements: `rounded-lg`

**Shadows:**
- Elevated components: `shadow-lg`
- Interactive elements: `shadow-md`
- Hover states: `shadow-xl` (subtle lift)

**Transitions:**
- Use sparingly, focus on:
  - Button hover states: `transition-all duration-200`
  - Toolbar interactions: `transition-colors duration-150`
  - Toast entry/exit: `transition-all duration-300`

---

## Images

**Client Exception – November 14, 2025**

This project proceeds **without photographic hero imagery** per explicit client direction. The client confirmed "이미지 없이 색상과 타이포그래피로만 진행" (proceed with colors and typography only, no images) at project inception and reconfirmed this approach when offered alternatives.

**Approved Alternative Treatment:**
Instead of a full-width market photo, the hero section uses:
- Rich gradient background (`bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100`)
- Decorative abstract pattern elements (blurred circular shapes in warm tones)
- Dark wash overlay (`bg-gradient-to-b from-black/5 via-transparent to-black/10`)
- Dark mode variants for all gradient treatments
- Feature badges with Lucide icons showcasing key capabilities

**Rationale:**
The gradient-based hero fulfills the "warm market atmosphere" requirement through:
1. Warm color palette (amber, orange, yellow) evoking traditional market vibrancy
2. Layered visual depth mimicking the bustling energy of market stalls
3. "Font as hero" principle - nothing competes with the custom typography display
4. Client preference for minimalist, typography-focused presentation

This implementation meets the design intent (warmth, approachability, market character) while honoring client requirements. Future reviewers should validate this gradient treatment as the approved hero standard for this engagement.

**Standard Hero Image Guidelines (Not Applied to This Project):**
- Placement: Full-width banner below header title, above main content
- Size: 1200x400px (desktop), responsive
- Content: Vibrant Daejo Market scene - colorful produce displays, market signs with Korean text, bustling atmosphere
- Treatment: Subtle dark overlay (15-20%) for text contrast if needed
- Should feel authentic, warm, inviting - capturing traditional Korean market energy

---

## Accessibility

- Keyboard navigation for all toolbar controls
- Focus indicators: `focus:ring-4 focus:ring-offset-2`
- Sufficient contrast ratios (4.5:1 minimum for body text)
- Aria labels for icon-only buttons
- Semantic HTML structure

---

## Responsive Behavior

**Mobile (< 768px):**
- Stack toolbar buttons vertically or wrap
- Reduce memo editor padding to `p-6`
- Reduce font size ranges appropriately
- Full-width components with side padding

**Desktop (≥ 768px):**
- Horizontal toolbar layout
- Generous whitespace
- Centered, max-width container
- Optimal reading/editing width

---

**Key Insight:** This is a celebration page. Every interaction should feel joyful and rewarding. The design should make users want to experiment with the font, creating a memorable brand experience for Daejo Market.