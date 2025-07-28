import React from 'react'

export default function FaqRenderer({ faq }) {
    return (
        <div>
            {faq.map((f, index) => {
                return (
                    <div key={index}>
                        <span key={index}>Question: {f.question}</span>
                        <br/>
                        <span key={index}>Answer:{f.answer}</span>
                    </div>
                )
            })}
        </div>
    )
}

