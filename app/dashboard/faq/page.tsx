"use client"
import React, { useEffect, useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { getAllFaq } from '@/utils/api';
import { Skeleton } from '@/components/ui/skeleton';

interface Faq {
  id: number;
  pertanyaan: string;
  jawaban: string;
}

function FaqSkeleton() {
  return (
    <div className="flex flex-col gap-2 w-full">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 px-6 py-5">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="flex-1 h-5" />
        </div>
      ))}
    </div>
  );
}

export default function Page() {
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaq = async () => {
      setLoading(true);
      setError(null);
      try {
        const data: Faq[] = await getAllFaq();
        setFaqs(
          (data || []).map((faq) => ({
            question: faq.pertanyaan,
            answer: faq.jawaban,
          }))
        );
      } catch (err: any) {
        setError(err.message || 'Gagal memuat FAQ');
      } finally {
        setLoading(false);
      }
    };
    fetchFaq();
  }, []);

  return (
    <div className="w-full flex justify-center font-sans">
      <div className="w-full max-w-xl">
        <div className="font-bold text-2xl mb-6 tracking-tight text-primary drop-shadow-sm text-center">FREQUENTLY ASK QUESTION</div>
        <div className="w-full">
          <Accordion type="single" collapsible className="w-full bg-white rounded-2xl shadow-lg p-2 border border-muted/40 transition-all duration-300 min-h-[220px]">
            {loading ? (
              <FaqSkeleton />
            ) : error ? (
              <div className="text-center py-10 text-red-500">{error}</div>
            ) : faqs.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">Belum ada FAQ</div>
            ) : (
              faqs.map((faq, idx) => (
                <AccordionItem value={String(idx)} key={faq.question + idx} className="border-b last:border-b-0 overflow-hidden">
                  <AccordionTrigger className="group flex items-center gap-3 px-6 py-5 text-base font-semibold text-left transition-colors duration-200 rounded-xl hover:bg-primary/5 focus:bg-primary/10 focus:outline-none">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200">
                      <HelpCircle size={20} />
                    </span>
                    <span className="flex-1 text-lg font-medium text-primary group-hover:text-primary/90 transition-colors duration-200">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-16 pb-6 pt-0 text-base text-muted-foreground bg-muted/30 border-l-4 border-primary/30 animate-fade-in rounded-bl-xl rounded-br-xl">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))
            )}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
