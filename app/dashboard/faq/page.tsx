"use client"
import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { HelpCircle } from 'lucide-react'

const faqs = [
  {
    question: 'Apa itu enkripsi gambar?',
    answer: 'Enkripsi gambar adalah proses mengamankan gambar agar tidak bisa diakses oleh pihak yang tidak berwenang.'
  },
  {
    question: 'Metode enkripsi apa saja yang digunakan di sistem ini?',
    answer: 'Sistem ini menggunakan kombinasi Caesar Cipher, Vigenere Cipher, dan AES.'
  },
  {
    question: 'Bagaimana cara kerja Caesar Cipher pada gambar?',
    answer: 'Caesar Cipher menggeser setiap byte data gambar dengan nilai tertentu agar data menjadi tidak terbaca.'
  },
  {
    question: 'Apa fungsi Vigenere Cipher dalam enkripsi gambar?',
    answer: 'Vigenere Cipher menambahkan lapisan keamanan dengan kunci berbasis kata untuk mengacak data gambar.'
  },
  {
    question: 'Mengapa AES digunakan setelah Caesar dan Vigenere?',
    answer: 'AES memberikan perlindungan tingkat lanjut dengan mengenkripsi data yang sudah diacak sebelumnya.'
  },
  {
    question: 'Apakah saya bisa mendekripsi gambar tanpa kunci?',
    answer: 'Tidak, gambar hanya bisa didekripsi jika memiliki kunci dan parameter yang benar.'
  },
  {
    question: 'Apakah proses enkripsi ini mempengaruhi kualitas gambar?',
    answer: 'Tidak, kualitas gambar akan tetap sama setelah didekripsi dengan benar.'
  },
]

export default function Page() {
  return (
    <div className="max-w-xl mx-auto mt-10 font-sans">
      <div className="font-bold text-2xl mb-6 tracking-tight text-primary drop-shadow-sm">FREQUENTLY ASK QUESTION</div>
      <Accordion type="single" collapsible className="bg-white rounded-2xl shadow-lg p-2 border border-muted/40">
        {faqs.map((faq, idx) => (
          <AccordionItem value={String(idx)} key={faq.question} className="border-b last:border-b-0 overflow-hidden">
            <AccordionTrigger className="group flex items-center gap-3 px-6 py-5 text-base font-semibold text-left transition-colors duration-200 rounded-xl hover:bg-primary/5 focus:bg-primary/10 focus:outline-none">
              <span className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 ${idx === 2 ? 'bg-primary text-white' : 'bg-muted text-primary'}`}>
                <HelpCircle size={20} />
              </span>
              <span className="flex-1 text-lg font-medium text-primary group-hover:text-primary/90 transition-colors duration-200">{faq.question}</span>
            </AccordionTrigger>
            <AccordionContent className="px-16 pb-6 pt-0 text-base text-muted-foreground bg-muted/30 border-l-4 border-primary/30 animate-fade-in rounded-bl-xl rounded-br-xl">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
