import { useEffect, useRef } from 'react'

export default function Banner(): JSX.Element {
    const banner = useRef<HTMLDivElement>(null)

    const atOptions = {
        'key': 'd88121e4f430e7ad4f995273d8de12e2',
        'format': 'iframe',
        'height': 60,
        'width': 468,
        'params': {}
    }
    useEffect(() => {
        if (!banner.current?.firstChild) {
            const conf = document.createElement('script')
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = `//www.highperformancedformats.com/${atOptions.key}/invoke.js`
            conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`

            if (banner.current) {
                banner.current.append(conf)
                banner.current.append(script)
            }
        }
    }, [])

    return <div ref={banner}></div>
}