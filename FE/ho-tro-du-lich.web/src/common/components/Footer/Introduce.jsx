/*
    items : [
        {
            text:string,
            url:string
        }
    ]
*/

import { Link } from "react-router-dom"



const IntroduceCol = ({ title, items }) => {
    return (
        <div className="introduce">
            <p className="fw-bold">{title}</p>
            <div className="introduce__items">
                {
                    items.map((item, idx) => (
                        <div key={idx}>
                            <Link className="text-black" style={{ textDecoration: 'none' }} to={item.url}>{item.text}</Link>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
export default IntroduceCol;