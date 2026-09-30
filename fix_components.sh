#!/bin/bash

# Task 6
sed -i '' 's/className="relative h-\[300px\] sm:h-\[400px\] lg:h-auto min-h-\[400px\]"/className="relative h-\[220px\] sm:h-\[340px\] lg:h-auto lg:min-h-\[400px\]"/g' components/home/FeaturedCaseStudy.tsx
sed -i '' 's/className="bg-\[#0B0D14\] p-8 sm:p-10 lg:p-14 flex flex-col justify-center"/className="bg-\[#0B0D14\] p-6 sm:p-10 lg:p-14 flex flex-col justify-center"/g' components/home/FeaturedCaseStudy.tsx
sed -i '' 's/className="grid grid-cols-2 gap-4 mb-10"/className="grid grid-cols-2 gap-3 mb-8"/g' components/home/FeaturedCaseStudy.tsx

# Task 7
sed -i '' 's/className="py-32 bg-\[#0B0D14\] relative overflow-hidden"/className="py-20 sm:py-32 bg-\[#0B0D14\] relative overflow-hidden"/g' components/home/WhyUs.tsx
sed -i '' 's/className="text-center mb-20"/className="text-center mb-12 sm:mb-20"/g' components/home/WhyUs.tsx
sed -i '' 's/className="group relative p-8 rounded-2xl border border-white\/5 bg-white\/\[0.02\] hover:border-white\/10 hover:bg-white\/\[0.04\] transition-all duration-500"/className="group relative p-5 sm:p-8 rounded-2xl border border-white\/5 bg-white\/\[0.02\] hover:border-white\/10 hover:bg-white\/\[0.04\] transition-all duration-500"/g' components/home/WhyUs.tsx

# Task 8
sed -i '' 's/className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"/className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4"/g' components/home/Recognition.tsx
sed -i '' 's/className="flex flex-col items-center text-center p-6 rounded-2xl border border-white\/5 bg-white\/\[0.02\] hover:border-violet-500\/20 hover:bg-white\/\[0.04\] transition-all duration-300 group"/className="flex flex-col items-center text-center p-4 sm:p-6 rounded-2xl border border-white\/5 bg-white\/\[0.02\] hover:border-violet-500\/20 hover:bg-white\/\[0.04\] transition-all duration-300 group"/g' components/home/Recognition.tsx

# Task 9
sed -i '' 's/className="py-24 bg-\[#0B0D14\] relative overflow-hidden border-t border-white\/5"/className="py-16 sm:py-24 bg-\[#0B0D14\] relative overflow-hidden border-t border-white\/5"/g' components/home/LiveMetrics.tsx
sed -i '' 's/className="group p-6 sm:p-8 rounded-2xl border border-white\/5 bg-white\/\[0.02\] hover:border-violet-500\/20 hover:bg-white\/\[0.04\] transition-all duration-500 text-center"/className="group p-5 sm:p-8 rounded-2xl border border-white\/5 bg-white\/\[0.02\] hover:border-violet-500\/20 hover:bg-white\/\[0.04\] transition-all duration-500 text-center"/g' components/home/LiveMetrics.tsx

# Task 10
sed -i '' 's/className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 mb-1.5 sm:mb-2"/className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 mb-1 sm:mb-2"/g' components/home/StatsSection.tsx

# Task 11
sed -i '' 's/py-32/py-20 sm:py-32/g' components/home/ProcessSection.tsx
sed -i '' 's/mb-20/mb-12 sm:mb-20/g' components/home/ProcessSection.tsx

# Task 12
sed -i '' 's/py-16/py-10 sm:py-16/g' components/home/ClientLogos.tsx
sed -i '' 's/mb-10/mb-6 sm:mb-10/g' components/home/ClientLogos.tsx

# Task 13
sed -i '' 's/<footer className="relative mt-24 bg-\[#05060A\] border-t border-white\/5">/<footer className="relative mt-16 sm:mt-24 bg-\[#05060A\] border-t border-white\/5">/g' components/layout/Footer.tsx
sed -i '' 's/className="container mx-auto px-6 pt-20 pb-10"/className="container mx-auto px-6 pt-12 sm:pt-20 pb-10"/g' components/layout/Footer.tsx
sed -i '' 's/className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8 xl:gap-12 mb-16"/className="grid gap-10 sm:gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8 mb-16"/g' components/layout/Footer.tsx

# Task 14
cat << 'CSS_EOF' >> app/globals.css

/* ── Mobile bare layout improvements ─────────────────────────────────────── */
@media (max-width: 639px) {
  /* Prevent any horizontal overflow on mobile */
  .overflow-hidden { overflow: hidden; }
  
  /* Kinetic marquee: smaller text so it doesn't cause layout shifts */
  .animate-marquee-fast { will-change: transform; }
  
  /* Section padding tightening */
  section { padding-left: 1.25rem; padding-right: 1.25rem; }
  section .container { padding-left: 0; padding-right: 0; }
}

/* Ensure horizontal scroll doesn't leak */
body { overflow-x: hidden; }
CSS_EOF

echo "Done modifying files"
