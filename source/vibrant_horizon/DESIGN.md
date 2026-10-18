---
name: Vibrant Horizon
colors:
  surface: '#fcf8f8'
  surface-dim: '#ddd9d9'
  surface-bright: '#fcf8f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f1edec'
  surface-container-high: '#ebe7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#444748'
  inverse-surface: '#313030'
  inverse-on-surface: '#f4f0ef'
  outline: '#747878'
  outline-variant: '#c4c7c8'
  surface-tint: '#5d5f5f'
  primary: '#5d5f5f'
  on-primary: '#ffffff'
  primary-container: '#ffffff'
  on-primary-container: '#747676'
  inverse-primary: '#c6c6c7'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e4e2e2'
  on-secondary-container: '#646464'
  tertiary: '#5d5f5f'
  on-tertiary: '#ffffff'
  tertiary-container: '#ffffff'
  on-tertiary-container: '#747676'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e4e2e2'
  secondary-fixed-dim: '#c8c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#fcf8f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

The design system is engineered to evoke a sense of professional wanderlust—combining the structural reliability of global travel platforms with the high-energy warmth of a boutique agency. The brand personality is adventurous yet meticulous, ensuring users feel both excited about their destination and secure in their booking.

The visual style is a fusion of **Minimalism** and **Glassmorphism**. It prioritizes extreme clarity and generous whitespace to allow high-quality travel photography to breathe. Glassmorphic elements are used strategically on interactive overlays and navigation bars to provide a sense of depth and modern premium quality without cluttering the interface.

## Colors

The palette is anchored in a crisp, high-end white to maximize the "breathability" of the layout. The primary action color is a vibrant **Accent Red**, used for critical CTAs and brand markers. A **Secondary Orange** provides a warm, sun-drenched complement, ideal for highlighting perks, ratings, or seasonal offers. 

Functional neutrals are kept cool and light to prevent the interface from feeling heavy. Use the Accent Red sparingly to maintain its urgency and impact, while the Secondary Orange can be used more liberally for decorative or secondary informative elements.

## Typography

This design system utilizes **Plus Jakarta Sans** for all levels of the hierarchy. This typeface was chosen for its modern, friendly, and geometric characteristics that balance professional SaaS aesthetics with approachable travel vibes.

- **Display levels** use extra-bold weights and tighter letter-spacing to create a "magazine" feel for destination titles.
- **Body text** is optimized for legibility with a slightly increased line-height to ensure comfort during long reading sessions of itinerary details.
- **Labels** utilize semibold weights to distinguish interactive elements from static content.

## Layout & Spacing

The layout follows a **fluid 12-column grid** on desktop and a **4-column grid** on mobile. The core philosophy is "Atmospheric Spacing," where large margins and gutters (24px+) are used to separate different logical sections, preventing the user from feeling overwhelmed by travel data.

- **Desktop:** Max-width of 1440px with 64px side margins.
- **Mobile:** Full width with 16px side margins.
- **Rhythm:** Use the 8px base unit for all internal component spacing (padding/margins). Consistency in these increments creates a subconscious sense of order.

## Elevation & Depth

Hierarchy is established through a combination of **Glassmorphism** and **Ambient Shadows**. 

1. **The Base Layer:** Pure white or very light gray (#F4F5F7).
2. **The Surface Layer (Cards/Containers):** Uses a subtle 1px border (Opacity 10% black) and a very soft, diffused shadow (Blur: 20px, Y: 10px, Opacity: 5% black).
3. **The Floating Layer (Search bars/Navigation):** Utilizes a backdrop-blur (12px) with a semi-transparent white fill (Opacity 70-80%). This creates the "glass" effect, allowing colors from background imagery to bleed through softly.

Avoid heavy black shadows. Instead, if a shadow is used on a colored background, tint the shadow with a darker version of that background color to maintain a premium feel.

## Shapes

The shape language is consistently soft and approachable. 
- **Standard UI elements** (inputs, small buttons) use a **0.5rem (8px)** radius.
- **Content Containers** (cards, images) use a **1rem (16px)** radius to create a friendlier, modern look.
- **Interactive Pill Elements** (tags, search filters) use a fully rounded radius to distinguish them from structural cards.

All images of destinations should share the same corner radius as their parent containers to ensure a cohesive, unified appearance.

## Components

### Buttons
- **Primary:** Solid Accent Red background, white text, 8px corner radius. Includes a subtle hover state that shifts slightly towards orange.
- **Secondary:** White background with an Accent Red 1.5px border or a ghost-glass effect (semi-transparent white) for use over imagery.

### Cards
Travel cards are the hero components. They feature a 16px corner radius, a soft ambient shadow, and no heavy borders. The "Price" and "Rating" are often placed in glassmorphic badges over the image.

### Input Fields
Search bars utilize a glassmorphic style when placed over hero images, or a clean white fill with a subtle light-gray border for forms. The focus state uses a 2px Accent Red ring with low opacity.

### Chips & Filters
Small, pill-shaped elements used for travel categories (e.g., "Beach," "Mountains"). Active states use the Secondary Orange to provide a warm, energetic highlight that contrasts with the primary navigation.

### List Items
Itinerary steps and feature lists use custom icons with a Secondary Orange circular background (opacity 10%) to draw the eye without being distracting.