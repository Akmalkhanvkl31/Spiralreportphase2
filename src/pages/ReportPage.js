/* eslint-disable no-unused-vars */
import React, { memo, useState, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, PieChart, Pie, Cell, Tooltip, 
ResponsiveContainer } from 'recharts';
import Header from '../components/Header';
import ToolsPage from './ToolsPage';
import '../css/Reportpagestyles.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';


const PrintButton = () => {
    const [isGenerating, setIsGenerating] = useState(false);
  
    const generatePDF = async () => {
      try {
        setIsGenerating(true);
        
        const loadingToast = toast.loading('Generating PDF...', {
          position: "bottom-right",
        });
        
        // Initialize PDF
        const pdf = new jsPDF({
          orientation: 'p',
          unit: 'mm',
          format: 'a4',
          compress: true
        });
  
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margins = {
          top: 25,
          bottom: 25,
          left: 20,
          right: 20
        };
  
        // Set base font
        pdf.setFont('helvetica');
        pdf.setFontSize(11);

        const adjustFontSizes = (element) => {
          // Define font sizes for different elements
          if (element.tagName.startsWith('H')) {
            switch(element.tagName) {
              case 'H1':
                element.style.fontSize = '32px'; // Increased from 24px
                element.style.marginBottom = '2.5rem';
                element.style.fontWeight = '700';
                break;
              case 'H2':
                element.style.fontSize = '28px'; // Increased from 20px
                element.style.marginBottom = '2rem';
                element.style.fontWeight = '600';
                break;
              case 'H3':
                element.style.fontSize = '24px'; // Increased from 18px
                element.style.marginBottom = '1.5rem';
                element.style.fontWeight = '600';
                break;
              default:
                element.style.fontSize = '20px'; // Increased from 16px
                element.style.marginBottom = '1.25rem';
                element.style.fontWeight = '500';
            }
          } else if (element.tagName === 'P') {
            element.style.fontSize = '16px'; // Increased from 12px
          } else {
            // For other elements like div, span, etc.
            const computedStyle = window.getComputedStyle(element);
            const currentSize = parseFloat(computedStyle.fontSize);
            
            // Only increase if the current size is too small
            if (currentSize < 16) {
              element.style.fontSize = '16px';
            }
          }

          // Adjust line height based on font size
          const fontSize = parseFloat(element.style.fontSize);
          if (fontSize >= 28) {
            element.style.lineHeight = '1.2';
          } else if (fontSize >= 20) {
            element.style.lineHeight = '1.3';
          } else {
            element.style.lineHeight = '1.5';
          }
        };
  
        const captureSection = async (section, isToolsSection = false) => {
          if (!section) return null;
          
          const sectionClone = section.cloneNode(true);
          document.body.appendChild(sectionClone);
          
          const elementsToAdjust = sectionClone.querySelectorAll('*');
          const originalStyles = new Map();
  
          elementsToAdjust.forEach(element => {
            originalStyles.set(element, {
              fontSize: element.style.fontSize,
              lineHeight: element.style.lineHeight,
              marginBottom: element.style.marginBottom,
              fontWeight: element.style.fontWeight,
              letterSpacing: element.style.letterSpacing,
              height: element.style.height,
              maxHeight: element.style.maxHeight,
              padding: element.style.padding
            });

            // Apply font size adjustments
            adjustFontSizes(element);

            // Additional styling
            element.style.letterSpacing = '0.01em';
            
            // Remove height constraints for tools section
            if (isToolsSection) {
              element.style.height = 'auto';
              element.style.maxHeight = 'none';
            }
          });

          try {
            // Special handling for tools section
            if (isToolsSection) {
              sectionClone.style.height = 'auto';
              sectionClone.style.maxHeight = 'none';
              sectionClone.style.overflow = 'visible';
              
              const toolsContent = sectionClone.querySelectorAll('.tools-content, .recommendation-card');
              toolsContent.forEach(element => {
                element.style.height = 'auto';
                element.style.maxHeight = 'none';
                element.style.overflow = 'visible';
              });
            }

            const canvas = await html2canvas(sectionClone, {
              scale: 3, // Increased scale for better quality
              useCORS: true,
              logging: false,
              allowTaint: true,
              backgroundColor: '#ffffff',
              width: section.offsetWidth,
              height: isToolsSection ? sectionClone.scrollHeight : section.offsetHeight,
              onclone: (clonedDoc) => {
                const clonedSection = clonedDoc.querySelector(`#${sectionClone.id}`);
                if (clonedSection) {
                  clonedSection.style.transform = 'none';
                  clonedSection.style.width = '100%';
                  clonedSection.style.margin = '0 auto';
                  clonedSection.style.padding = `${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm`;
                }
              }
            });

            document.body.removeChild(sectionClone);
            return canvas;

          } catch (error) {
            console.error('Error capturing section:', error);
            document.body.removeChild(sectionClone);
            return null;
          }
        };
  
        const sections = [
          document.querySelector('.report-container'),
          document.querySelector('.snapshot-section'),
          ...Array.from(document.querySelectorAll('.recommendation-section')),
          document.querySelector('.tools-page')
        ].filter(Boolean);
  
        sections.forEach((section, index) => {
          if (!section.id) section.id = `pdf-section-${index}`;
        });
  
        let isFirstPage = true;
        let currentY = margins.top;
  
        for (const [index, section] of sections.entries()) {
          const isToolsSection = section.classList.contains('tools-page');
          const canvas = await captureSection(section, isToolsSection);
          if (!canvas) continue;
  
          const imgWidth = pageWidth - (margins.left + margins.right);
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
          if (isToolsSection || (!isFirstPage && currentY + imgHeight > pageHeight - margins.bottom)) {
            pdf.addPage();
            currentY = margins.top;
          }
  
          pdf.addImage(
            canvas.toDataURL('image/png', 1.0),
            'PNG',
            margins.left,
            currentY,
            imgWidth,
            imgHeight,
            undefined,
            'FAST'
          );
  
          currentY += imgHeight + (isToolsSection ? 10 : 15);
          isFirstPage = false;
  
          if (currentY > pageHeight - margins.bottom && index < sections.length - 1) {
            pdf.addPage();
            currentY = margins.top;
          }
        }
  
        // Add page numbers with larger font
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(10); // Increased from 9
          pdf.setTextColor(128, 128, 128);
          pdf.text(
            `Page ${i} of ${totalPages}`,
            pageWidth / 2,
            pageHeight - 10,
            { align: 'center' }
          );
        }
  
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        pdf.save(`SOC1_Assessment_Report_${timestamp}.pdf`);

        toast.update(loadingToast, {
          render: "PDF generated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
  
      } catch (error) {
        console.error('Error generating PDF:', error);
        toast.error('Error generating PDF. Please try again.', {
          position: "bottom-right",
        });
      } finally {
        setIsGenerating(false);
      }
    };
  
    return (
      <button
        onClick={generatePDF}
        disabled={isGenerating}
        style={{
          position: 'fixed',
          right: '2rem',
          top: '6rem',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#EF4444',
          color: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          transition: 'background-color 0.2s',
          cursor: isGenerating ? 'not-allowed' : 'pointer',
          opacity: isGenerating ? 0.5 : 1
        }}
      >
        {isGenerating ? (
          <span className="loading-spinner" style={{
            width: '1.25rem',
            height: '1.25rem',
            border: '2px solid #fff',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'spin 1s linear infinite'
          }} />
        ) : (
          <svg 
            width="20"
            height="20"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" 
            />
          </svg>
        )}
        {isGenerating ? 'Generating...' : 'Generate PDF'}
      </button>
    );
  };
  
const riskColors = {
high: {
primary: '#ef4444',
secondary: '#fee2e2'
},
medium: {
primary: '#f97316',
secondary: '#ffedd5'
},
low: {
primary: '#22c55e',
secondary: '#dcfce7'
}
};
const getRiskColor = (risk, type = 'text') => {
switch (risk.toLowerCase()) {
case 'high':
return type === 'text' ? 'text-red-500' : riskColors.high;
case 'medium':
return type === 'text' ? 'text-orange-500' : riskColors.medium;
case 'low':
return type === 'text' ? 'text-green-500' : riskColors.low;
default:
return type === 'text' ? 'text-gray-500' : { primary: '#9ca3af', secondary: '#f3f4f6' };
}
};
const RiskLegend = ({ data, activeIndex }) => (
<div className="absolute right-0 top-1/2 -translate-y-1/2 pr-8">
{Object.entries(
data.reduce((acc, item) => {
acc[item.risk] = (acc[item.risk] || 0) + 1;
return acc;
}, {})
).map(([risk, count]) => (
<div
key={risk}
className={`flex items-center gap-2 mb-2 transition-opacity duration-200 ${
activeIndex !== null ? 'opacity-50' : 'opacity-100'
}`}
>
<div
className="w-3 h-3 rounded-full"
style={{ backgroundColor: riskColors[risk.toLowerCase()]?.primary }}
/>
<span className="text-sm font-medium text-gray-600">
{risk} Risk ({count})
</span>
</div>
))}
</div>
);
const CustomTooltip = ({ active, payload }) => {
if (active && payload && payload.length) {
const { recommendation_title, risk } = payload[0].payload;
return (
<div className="bg-white p-4 shadow-lg rounded-lg border border-gray-100">
<p className="text-sm font-medium text-gray-900 mb-2">{recommendation_title}</p>
<p className="text-sm font-medium" style={{ color: riskColors[risk.toLowerCase()]?.primary }}>
{risk} Risk
</p>
</div>
);
}
return null;
};
const RenderPieChart = memo(function RenderPieChart({ data, activeIndex, onHover }) {
const renderCells = useMemo(() =>
data.map((entry, index) => (
<Cell
key={`cell-${index}`}
fill={entry.color}
opacity={activeIndex === null || activeIndex === index ? 1 : 0.3}
stroke={activeIndex === index ? '#fff' : 'none'}
strokeWidth={2}
/>
)), [data, activeIndex]
);
const handleMouseEnter = useCallback((_, index) => {
if (activeIndex !== index) {
onHover(index);
}
}, [activeIndex, onHover]);
const handleMouseLeave = useCallback(() => {
if (activeIndex !== null) {
onHover(null);
}
}, [activeIndex, onHover]);
return (
<div className="w-96 h-96 relative">
<div className="absolute inset-0 flex items-center justify-center">
<div className="text-center">
<h4 className="text-2xl font-bold text-gray-900">{data.length}</h4>
<p className="text-sm text-gray-500 font-medium">Total Findings</p>
</div>
</div>
<ResponsiveContainer width="100%" height="100%">
<PieChart>
<Pie
data={data}
cx="50%"
cy="50%"
innerRadius={85}
outerRadius={120}
fill="#8884d8"
paddingAngle={8}
dataKey="value"
onMouseEnter={handleMouseEnter}
onMouseLeave={handleMouseLeave}
>
{renderCells}
</Pie>
<Tooltip content={<CustomTooltip />} />
</PieChart>
</ResponsiveContainer>
</div>
);
});
const CircleProgress = ({ percentage }) => {
const radius = 80;
const circumference = 2 * Math.PI * radius;
const strokeDashoffset = circumference - (percentage / 100) * circumference;
return (
<svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
<circle
cx="90"
cy="90"
r={radius}
fill="none"
stroke="#f3f4f6"
strokeWidth="12"
/>
<circle
cx="90"
cy="90"
r={radius}
fill="none"
stroke="#EF4444"
strokeWidth="12"
strokeLinecap="round"
strokeDasharray={circumference}
strokeDashoffset={strokeDashoffset}
style={{ transition: 'stroke-dashoffset 0.5s ease' }}
/>
</svg>
);
};
const Dashboard = memo(({ generation, transformedData, intro }) => {
const readinessScore = generation?.total_assessment_maturity?.overall_maturity_level || 0;
return (
<div className="report-container">
<div className="flex-container">
<div className="main-content">
<div className="header-section">
<h1 className="text-4xl font-bold mb-4" style={{ marginTop: '186px' }}>
Your total readiness for <span className="text-red-500">SOC 1</span> stands at <span className="text-red500">{generation?.total_assessment_maturity?.overall_maturity_level || '0%'}</span>
</h1>
<p className="description">{intro || 'No introduction available.'}</p>
</div>
<div className="chart-section">
<div className="chart-header">
<span className="infinity-symbol">∞</span>
<h2 className="chart-title">
Results derived from your responses to questions for each track
</h2>
</div>
<div className="chart-container">
<ResponsiveContainer>
<RadarChart data={transformedData}>
<PolarGrid gridType="polygon" />
<PolarAngleAxis
dataKey="category"
tick={{ fill: '#4B5563', fontSize: 12 }}
/>
<PolarRadiusAxis angle={90} domain={[0, 12]} />
<Radar
name="Current Score"
dataKey="currentScore"
stroke="#EF4444"
fill="#EF4444"
fillOpacity={0.6}
/>
<Radar
name="Target Score"
dataKey="targetScore"
stroke="#48BB78"
fill="#48BB78"
fillOpacity={0.2}
/>
<Legend />
</RadarChart>
</ResponsiveContainer>
</div>
</div>
</div>
<aside className="sidebar">
<div className="card">
<div className="card-header">
<h3 className="card-title">Your Readiness Score</h3>
<p className="card-subtitle">SOC 1 Assessment Progress</p>
</div>
<div className="progress-container">
<CircleProgress percentage={readinessScore} />
<div className="progress-text">
<div className="progress-percentage">{readinessScore}%</div>
<div className="progress-label">Complete</div>
</div>
</div>
<div className="divider" />
<div className="categories-section">
<div className="categories-header">
<h4 className="categories-title">Readiness by category</h4>
<p className="categories-subtitle">
Your readiness from your responses
</p>
</div>
{transformedData?.map((category, index) => (
<div key={index} className="category-item">
<span className="category-label">
{category.category}
</span>
<span className="category-score">
{category.currentScore}%
</span>
</div>
))}
</div>
</div>
</aside>
</div>
</div>
);
});
const SnapshotSection = memo(({ findings }) => {
return (
<div className="snapshot-section">
<div className="snapshot-header">
<div className="inline-flex items-center justify-center mb-6 p-4 bg-white rounded-full shadow-md border border-gray200">
<span className="text-red-500 text-3xl font-bold">∞</span>
</div>
<h2 className="text-3xl font-bold text-gray-800">
Here's the latest SOC 1 snapshot,
<br />
tailored from your inputs!
</h2>
<div className="w-16 h-1 mx-auto mt-4 bg-red-500 rounded"></div>
</div>
<div className="snapshot-grid">
{findings.map((item, index) => (
<div key={index} className="recommendation-card">
<h3 className="text-red-500 font-semibold text-lg border-b border-gray-200 pb-2 mb-4">
{item.title}
</h3>
<p className="text-gray-600 text-sm">
{item.current_state}
</p>
</div>
))}
</div>
</div>
);
});
const RecommendationSection = memo(({ title, findings = [], index = 0 }) => {
const [hoveredRecommendation, setHoveredRecommendation] = useState(null);
const isEven = index % 2 === 0;
const pieData = useMemo(() => {
const sliceValue = 100 / findings.length;
return findings.map((finding) => {
const riskColorSet = getRiskColor(finding.risk, 'color');
return {
name: finding.recommendation_title,
value: sliceValue,
color: riskColorSet.primary,
...finding
};
});
}, [findings]);
const handleHover = useCallback((index) => {
setHoveredRecommendation(index);
}, []);
return (
<div className="recommendation-section">
<div className="recommendation-header">
<span className="inline-block px-4 py-1 bg-red-400/20 rounded-full text-sm font-semibold mb-6">
Recommendations
</span>
<h2 className="text-5xl font-bold mb-6 max-w-3xl mx-auto leading-tight">
{title}
</h2>
</div>
<div className="recommendation-content">
<div className={`flex gap-16 items-start ${isEven ? '' : 'flex-row-reverse'}`}>
<div className="flex-shrink-0">
<RenderPieChart
data={pieData}
activeIndex={hoveredRecommendation}
onHover={handleHover}
/>
</div>
<div className="flex-1 space-y-6">
{findings.map((finding, index) => (
<div
key={index}
className={`recommendation-card ${
hoveredRecommendation === index ? 'bg-gray-50 shadow-sm' : ''
} ${
hoveredRecommendation !== null && hoveredRecommendation !== index
? 'opacity-40'
: 'opacity-100'
}`}
onMouseEnter={() => handleHover(index)}
onMouseLeave={() => handleHover(null)}
>
<div className="p-6">
<div className="flex items-start justify-between gap-4">
<div className="flex-1">
<div className="flex items-center gap-3 mb-2">
<span className="text-lg font-bold text-gray-400">
{String(index + 1).padStart(2, '0')}
</span>
<h4 className="text-lg font-semibold text-gray-900">
{finding.recommendation_title}
</h4>
</div>
<p className="text-gray-600 leading-relaxed pl-10">
{finding.recommendation_description}
</p>
</div>
<div className={`${getRiskColor(finding.risk, 'text')} font-semibold`}>
{finding.risk} Risk
</div>
</div>
</div>
</div>
))}
</div>
</div>
</div>
</div>
);
});
const SOC1Assessment = () => {
const location = useLocation();
const reportData = location.state?.reportData || {};
const generation = useMemo(() =>
reportData?.generation || reportData?.data?.generation,
[reportData]
);
const findings = useMemo(() =>
generation?.summary_of_findings || [],
[generation]
);
const intro = useMemo(() =>
generation?.introduction || "",
[generation]
);
const transformedData = useMemo(() =>
generation?.summary_of_findings?.map(item => ({
category: item.title,
currentScore: item.score,
targetScore: item.next_level_score
})) || [],
[generation]
);
return (
    <div className="min-h-screen bg-white">
      <Header />
      <PrintButton /> {/* Added Print Button here */}
      <main>
        <Dashboard
          generation={generation}
          transformedData={transformedData}
          intro={intro}
        />
        <SnapshotSection findings={findings} />
        {findings.length > 0 && findings.map((finding, index) => (
          <RecommendationSection
            key={index}
            title={finding.title}
            findings={finding.recommendations_for_improvement || []}
            index={index}
          />
        ))}
        <ToolsPage reportData={reportData} />
      </main>
    </div>
  );
};

export default SOC1Assessment