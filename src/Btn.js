import React from 'react'

export default function Btn(props) {
	return (
		<svg
			onClick={props.fn}
			xmlns='http://www.w3.org/2000/svg'
			width='48'
			height='48'
			viewBox='0 0 48 48'
			fill='none'
		>
			<path
				d='M41.1973 22.2921L15.0407 6.35295C13.708 5.5408 12 6.50011 12 8.06083V39.9392C12 41.4999 13.708 42.4592 15.0407 41.647L41.1973 25.7079C42.4763 24.9285 42.4763 23.0715 41.1973 22.2921Z'
				stroke='#B7FC76'
				strokeWidth='4'
				strokeLinejoin='round'
			/>
		</svg>
	)
}
