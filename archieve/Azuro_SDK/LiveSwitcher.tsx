// 'use client'
// import { useLive } from "@azuro-org/sdk"
// import { useEffect } from "react"

// export function LiveSwitcher() {
//   const {isLive, changeLive } = useLive()

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     changeLive(event.target.checked)
//   }

//   useEffect(() => {
//     if (!isLive) {
//       changeLive(true)
//     }
//   }, [])

//   return (
//     <div className="flex items-center mr-4">
//       <label className="mr-2" htmlFor="live">Live</label>
//       <input id="live" type="checkbox" checked={isLive} onChange={handleChange} />
//     </div>
//   )
// }
