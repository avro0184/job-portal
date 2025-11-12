import React from 'react'

export default function GeneretedQuestionIcon() {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="currentColor" />
        <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="16" cy="16" r="5" fill="white" />
        <text
          x="16"
          y="16"
          fontSize="8"
          fontWeight="bold"
          fill="black"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          ?
        </text>
      </svg>


    </>
  )
}
