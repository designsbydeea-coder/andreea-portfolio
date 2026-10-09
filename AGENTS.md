# Portfolio implementation rules

This repository is a graphic design portfolio.

The Figma design is the authoritative source of truth.

Do not redesign, reinterpret, simplify, improve, modernize, or add visual elements unless explicitly instructed.

Priorities:
1. Maximum visual fidelity to the supplied Figma design.
2. Preserve exact typography, spacing, proportions, imagery, crop, colors, and visual hierarchy.
3. Use the provided assets exactly as supplied.
4. Do not replace icons, logos, illustrations, or photography with substitutes.
5. Keep desktop implementation faithful to the 1440px Figma layout.
6. Build responsive-friendly code, but do not alter the desktop appearance in order to achieve responsiveness.
7. Do not create mobile-specific redesigns until explicitly instructed.
8. Normal text must remain HTML text, not rasterized images.
9. SVG assets should remain SVG where provided.
10. Do not optimize or modify source image files unless explicitly instructed.

Technical approach:
- Prefer simple semantic HTML, CSS, and minimal JavaScript.
- Avoid unnecessary frameworks or dependencies.
- Keep shared header/footer styles reusable.
- Keep project pages independently art-directed rather than forcing them into one generic layout.
