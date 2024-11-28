/* eslint-disable no-unused-vars */
import React from 'react';
import { Infinity, DraftingCompass } from 'lucide-react';

const Section = ({ children, bgColor = "bg-white", className = "" }) => (
  <div className={`${bgColor} px-4 py-16 ${className}`}>
    <div className="max-w-7xl mx-auto">
      {children}
    </div>
  </div>
);

const SectionHeader = ({ title, subtitle }) => (
  <div className="text-center">
    <Infinity className="w-12 h-12 mx-auto mb-4" aria-label="Infinity icon" />
    <h2 className="text-4xl font-bold mb-4">{title}</h2>
    {subtitle && <p className="text-lg opacity-90">{subtitle}</p>}
  </div>
);

const BulletPoint = ({ children }) => (
  <li className="flex items-start gap-3">
    <div className="mt-2">
      <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
    </div>
    <p className="text-gray-700 leading-relaxed">{children}</p>
  </li>
);

const ToolCard = ({ tool }) => (
  <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative">
    <div className="absolute -top-3 right-6">
      <span className="inline-block bg-[#fef2f2] px-4 py-1.5 rounded-full text-xs font-semibold text-[#ef4444] tracking-wide">
        {tool.tag || 'Tool'}
      </span>
    </div>
    <div className="flex items-start gap-5">
      <div className="p-3.5 bg-[#fef2f2] rounded-lg flex-shrink-0">
        <DraftingCompass className="w-7 h-7 text-[#ef4444]" />
      </div>
      <div>
        <h3 className="text-2xl font-semibold text-gray-900 leading-tight mb-4">
          {tool.name || tool.product_name}
        </h3>
        <p className="text-base text-gray-600 leading-relaxed">
          {tool.purpose || tool.description}
        </p>
      </div>
    </div>
  </div>
);

const calculateMaturityScore = (data) => {
  const generation = data?.generation || data?.data?.generation;
  const toolsData = generation?.recommendations_for_cybersecurity_tools;

  if (generation?.total_assessment_maturity?.overall_maturity_level) {
    const score = generation.total_assessment_maturity.overall_maturity_level;
    const numericScore = parseFloat(score.toString().replace('%', ''));
    return `${Math.round(numericScore)}%`;
  }

  const currentTools = toolsData?.current_tools || [];
  const recommendedTools = toolsData?.recommended_cybersecurity_products || [];

  const implementationWeight = 0.6;
  const recommendationWeight = 0.4;

  const totalPossibleTools = currentTools.length + recommendedTools.length;
  if (totalPossibleTools === 0) return '0%';

  const implementationScore = (currentTools.length / totalPossibleTools) * 100 * implementationWeight;
  const recommendationImpact = ((totalPossibleTools - recommendedTools.length) / totalPossibleTools) * 100 * recommendationWeight;

  const finalScore = Math.round(implementationScore + recommendationImpact);
  return `${Math.min(Math.max(finalScore, 0), 100)}%`;
};

const ToolsPage = ({ reportData }) => {
  const generation = reportData?.generation || reportData?.data?.generation;
  const recommendedTools = generation?.recommendations_for_cybersecurity_tools?.recommended_cybersecurity_products;
  const currentTools = generation?.recommendations_for_cybersecurity_tools?.current_tools;
  const conclusion = generation?.conclusion;
  const noCurrentToolsMessage = "No tools currently in use";
  const maturityScore = calculateMaturityScore(reportData);

  return (
    <div className="min-h-screen bg-white">
      <Section bgColor="bg-[#ef4444]" className="text-white">
        <SectionHeader
          title="Tools Currently in Use"
          subtitle="Suggested Best Practices for the tools currently being utilized"
        />
      </Section>
      <Section>
        <div className="max-w-7xl mx-auto">
          {Array.isArray(currentTools) && currentTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {currentTools.map((tool) => (
                <ToolCard
                  key={tool.tool_name}
                  tool={{
                    name: tool.tool_name,
                    purpose: tool.recommendations,
                    tag: "Current Tool"
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <p className="text-gray-700 text-lg">{noCurrentToolsMessage}</p>
            </div>
          )}
        </div>
      </Section>

      <div className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Infinity className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-4xl font-bold mb-16">Additional Tool Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {Array.isArray(recommendedTools) && recommendedTools.length > 0 ? (
              recommendedTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={{
                    ...tool,
                    tag: "Recommended"
                  }}
                />
              ))
            ) : (
              <p className="text-gray-700">No additional tool recommendations available.</p>
            )}
          </div>
        </div>
      </div>

      <Section bgColor="bg-[#ef4444]" className="text-white">
        <div className="text-center">
          <Infinity className="w-12 h-12 mx-auto mb-6" aria-label="Infinity icon" />
          <h2 className="text-2xl font-medium mb-4">Total Assessment Maturity Score is</h2>
          <p className="text-7xl font-bold">{maturityScore}</p>
        </div>
      </Section>

      <Section>
        <div className="bg-white py-2 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <Infinity className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-16">List Of Threats</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(generation?.list_of_threats) && generation?.list_of_threats.length > 0 ? (
                generation.list_of_threats.map((threat, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-6 text-left h-full flex items-center justify-center"
                  >
                    <p className="text-gray-800 text-sm font-medium">{threat}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-700">No threats listed.</p>
              )}
            </div>
          </div>
        </div>
      </Section>

      <div className="bg-[#ef4444]">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-white text-center mb-16">
            <SectionHeader title="Conclusion" />
            <p className="text-lg leading-relaxed max-w-3xl mx-auto">
              {conclusion}
            </p>
          </div>
          <div className="bg-white rounded-xl p-16 text-center shadow-2xl mx-auto max-w-3xl">
            <h3 className="text-gray-900 text-4xl font-bold mb-10">
              Want To Level Up Your Compliance?
            </h3>
            <a href="https://spiralreports.com/contact-us" target="_blank" rel="noopener noreferrer">
              <button className="bg-[#ef4444] text-white px-10 py-5 rounded-full hover:bg-[#dc2626] transition-all duration-200 font-medium text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Schedule a call with us
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;
