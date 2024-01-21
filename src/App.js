import 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-cloud_editor_dark'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/keybinding-vscode'
import 'ace-builds/src-noconflict/theme-chaos'
import 'ace-builds/src-noconflict/snippets/javascript'
import { IoLogoJavascript } from 'react-icons/io5'
import Btn from './Btn'
import shade from './shade.svg'
import AceEditor from 'react-ace'
import beautify from 'json-beautify'
import 'highlight.js/styles/atom-one-dark.min.css'
import hljs from 'highlight.js'
import { useEffect, useState } from 'react'
const styleofP = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	fontFamily: 'sans-serif',
	color: 'white',
	fontSize: '1rem',
	marginTop: '1.5rem',
	gap: '10px',
	fontWeight: 500,
}

let id = 0
let append = el => {
	let element = document.getElementById('output')

	let dv = document.createElement('div')
	let pr = document.createElement('pre')
	let cd = document.createElement('code')
	let p = document.createElement('p')
	dv.classList.add('content-output-div')
	pr.classList.add('console-content')
	p.classList.add('console-line')

	cd.textContent = el[0]
	p.textContent = 'app.js:' + el[1]
	pr.appendChild(cd)
	dv.appendChild(pr)
	dv.appendChild(p)
	element.appendChild(dv)
	if (el[2]) {
		cd.classList.add('language-json')
		cd.id = `code${id}`
		cd.classList.add('console-code')
		hljs.highlightElement(cd)
	}
	id++
}

function App() {
	let [code, setCode] = useState()
	let [val, setVal] = useState()
	//let [isError, setIsError] = useState()

	useEffect(() => {
		//hljs.highlightAll()
		function isApple() {
			var expression = /(Mac|iPhone|iPod|iPad)/i
			return expression.test(navigator.platform)
		}

		function isControl(event) {
			// Returns true if Ctrl or cmd keys were pressed.
			if (isApple()) {
				return event.metaKey
			}
			return event.ctrlKey // Windows, Linux, UNIX
		}

		function isSelecting(event, k) {
			if (isControl(event)) {
				return event.key === k
			}
			return false
		}
		document.addEventListener('keydown', e => {
			let selectedText = window.getSelection().toString()
			let curs = document
				.getElementsByClassName('ace_cursor')[0]
				.style.cssText.split(';')[1]
				.split(':')[1]
				.split(',')[1]
				.slice(0, -3)
				.trim()
			if (isSelecting(e, 'c') && selectedText.length <= 1) {
				let num = Number(curs) / 22
				navigator.clipboard.writeText(code.split('\n')[num].trim())
			}
			if (isSelecting(e, 'x') && selectedText.length <= 1) {
				let num = Number(curs) / 22
				navigator.clipboard.writeText(code.split('\n')[num])
				let newCode = code.split('\n')
				newCode[num] = ''
				console.log(newCode)
				code = newCode.join('\n')
				setVal(newCode.join('\n'))
				setCode(newCode.join('\n'))
			}
		})
	})
	function onChange(newValue) {
		code = newValue
	}
	let lines = []
	function onClick() {
		let linesIndex = 0
		// eslint-disable-next-line no-unused-vars
		let addConsole = (...content) => {
			let isTherAnObject = false
			content.forEach(el => {
				if (typeof el == 'object') {
					isTherAnObject = true
				}
			})

			if (!isTherAnObject) {
				let str = ''
				content.forEach(el => {
					str = str.concat(el)
				})
				let item = [str, lines[linesIndex], false]
				append(item)
			} else {
				let str = ''

				content.forEach(el => {
					if (typeof el === 'object') {
						if (str === '') {
							str = beautify(el, null, 2, 60) + '\n'
						} else {
							str = str + '\n' + beautify(el, null, 2, 60) + '\n'
						}
					} else {
						str = str + el
					}
				})

				append([str, lines[linesIndex], true])
			}
			linesIndex++
		}

		if (code !== undefined) {
			let out = code.split('\n')
			let fout = []
			lines = []
			out.forEach((line, i) => {
				let line1 = line
				if (line.includes('console.log')) {
					line1 = line1.replaceAll(
						`console.log`,
						`lines.push(${i} + 1);addConsole`
					)
				}
				fout.push(line1)
			})
			document.getElementById('output').innerHTML = ''
			//eval(fout.join('\n'))

			try {
				// eslint-disable-next-line no-eval
				eval(fout.join('\n'))
			} catch (err) {
				let errPlace = document.createElement('div')
				errPlace.classList.add('oaerror')
				errPlace.classList.add('danger')
				errPlace.id = 'erp'
				document.getElementById('output').appendChild(errPlace)
				document.getElementById(
					'erp'
				).innerHTML = `<strong>${err.name}</strong>&nbsp;-&nbsp;${err.message}`
			}
		} else {
			handleClick()
		}
	}
	let Edit = props => {
		return (
			<AceEditor
				mode='javascript'
				theme='chaos'
				placeholder='write some javascript code here'
				keybinding='keybinding-vscode'
				onChange={onChange}
				handleClick={handleClick}
				className='editor'
				fontSize={18}
				name='myEditor'
				highlightActiveLine={false}
				showGutter={false}
				editorProps={{ $blockScrolling: true }}
				value={props.val}
				id='edit'
				setOptions={{
					fontFamily: 'Fragment Mono',
					wrap: true,
					useWorker: false,
					enableBasicAutocompletion: true,
					enableLiveAutocompletion: true,
					enableSnippets: true,
					showLineNumbers: false,
					tabSize: 2,
					selectionStyle: 'text',
				}}
			/>
		)
	}
	let handleClick = () => {
		let cl = `console.log("write some code above")`
		code = cl
		setCode(cl)
		val = ''
		let i = 0
		function addone() {
			if (val !== cl) {
				val = val + cl[i]
				setVal(val)
				i++
			} else {
				setCode(cl)
				clearInterval(k)
				onClick()
			}
		}

		let k = setInterval(addone, 50)
	}
	return (
		<div className='App'>
			<div className='container'>
				<p style={styleofP}>
					<IoLogoJavascript style={{ color: 'yellow', fontSize: '20px' }} />
					app.js
				</p>
				<div className='inpOut'>
					<Edit val={val} />
					<div className='output'>
						<p className='output-title'>Console</p>
						<div className='output-content' id='output'></div>
					</div>
				</div>
				<div className='btn-shads'>
					<Btn className='butn' id='btn' fn={onClick} />
					<img src={shade} className='shade' alt='shade' draggable='false' />
				</div>
			</div>
		</div>
	)
}

export default App

/* 
// achno ndiro lfo9 bach ikhrej lina >> true
// mat9isich hadchi lli lte7t 
If (a==b) {
  System.out.println("true");
}
Else { 
  System.out.println("false")
}
*/
