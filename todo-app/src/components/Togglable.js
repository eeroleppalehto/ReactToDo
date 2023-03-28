import { useState } from "react"
import PropTypes from "prop-types"

const Togglable = (props) => {
    const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? 'none' : ''}
    const showWhenVisible = { display: visible ? '' : 'none'}

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    return(
        <>
            <div style={hideWhenVisible}>
                <button className="btn toggle-btn" onClick={toggleVisibility}>
                    {props.buttonLabel}
                </button>
            </div>
            <div style={showWhenVisible}>
                {props.children}
                <button className="btn toggle-btn" onClick={toggleVisibility}>
                Cancel
                </button>
            </div>
        </>
    )
}

Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired
}

export default Togglable