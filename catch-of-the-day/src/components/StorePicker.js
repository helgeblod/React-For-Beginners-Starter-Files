import React from 'react';

class StorePicker extends React.Component {
    render () {
        return (
                <form className="store-selector">
                <h1>Please select store</h1>
                <input type="text" required placeholder="store name"/>
                <button type="submit">Visit store -></button>
                </form>
        )
    }
}

export default StorePicker
