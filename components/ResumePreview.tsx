
import React from 'react';
import { ResumeData } from '../types';

interface ResumePreviewProps {
  data: ResumeData;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
  if (!data || !data.personalInfo) {
    return <div className="p-8 text-center text-zinc-400">No content generated yet.</div>;
  }

  const { personalInfo, summary, experience = [], education = [], skills = [] } = data;

  return (
    <div 
      id="resume-preview-container" 
      className="bg-white text-black p-[0.7in] w-[210mm] min-h-[297mm] mx-auto resume-font text-[10.5pt] leading-[1.35] box-border"
    >
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-[26pt] font-black uppercase tracking-tight mb-3">
          {personalInfo.name}
        </h1>
        <div className="text-[9.5pt] font-medium text-zinc-800 flex flex-wrap justify-center items-center gap-x-2">
          <span>{personalInfo.location}</span>
          <span className="text-zinc-300">•</span>
          <span>{personalInfo.phone}</span>
          <span className="text-zinc-300">•</span>
          <span className="underline decoration-zinc-300 underline-offset-2">{personalInfo.email}</span>
          {personalInfo.linkedin && (
            <>
              <span className="text-zinc-300">•</span>
              <span className="underline decoration-zinc-300 underline-offset-2">{personalInfo.linkedin.replace('https://', '')}</span>
            </>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-8">
          <p className="text-[10pt] text-zinc-800 text-justify italic leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-[12pt] font-black uppercase tracking-widest text-black">Experience</h2>
            <div className="h-[1.5px] bg-black/10 flex-1"></div>
          </div>
          
          <div className="space-y-6">
            {experience.map((exp, i) => (
              <div key={i} className="break-inside-avoid">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[11.5pt] font-bold">{exp.company}</span>
                  <span className="text-[10pt] font-bold italic text-zinc-600">{exp.location}</span>
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-[10pt] font-bold text-zinc-700">{exp.role}</span>
                  <span className="text-[9pt] font-bold text-zinc-500 tracking-tighter">{exp.duration}</span>
                </div>
                <ul className="list-disc list-outside ml-5 space-y-1.5">
                  {(exp.bullets || []).map((bullet, j) => (
                    <li key={j} className="text-[10pt] text-zinc-800 pl-1">{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-[12pt] font-black uppercase tracking-widest text-black">Education</h2>
            <div className="h-[1.5px] bg-black/10 flex-1"></div>
          </div>
          <div className="space-y-4">
            {education.map((edu, i) => (
              <div key={i} className="flex justify-between items-start break-inside-avoid">
                <div>
                  <div className="text-[11pt] font-bold">{edu.institution}</div>
                  <div className="text-[10pt] italic text-zinc-600 font-medium">{edu.degree}</div>
                </div>
                <div className="text-right">
                  <div className="text-[9.5pt] font-bold tracking-tighter text-zinc-700">{edu.duration}</div>
                  <div className="text-[9pt] font-bold text-zinc-400 uppercase tracking-widest">{edu.location}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-[12pt] font-black uppercase tracking-widest text-black">Skills</h2>
            <div className="h-[1.5px] bg-black/10 flex-1"></div>
          </div>
          <div className="space-y-2">
            {skills.map((skill, i) => (
              <div key={i} className="text-[10pt] flex gap-3 break-inside-avoid">
                <span className="font-black text-zinc-900 min-w-[140px] text-[9.5pt]">{skill.category}:</span>
                <span className="text-zinc-700">{(skill.items || []).join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
