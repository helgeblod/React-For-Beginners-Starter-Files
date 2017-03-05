import React from 'react';
import { getFunName } from '../helpers'

class StorePicker extends React.Component {
    goToStore (event) {
        event.preventDefault();
        console.log("You changed url to !");
        const storeId = this.storeInput.value;
        console.log(`Going to ${storeId}`)
        this.context.router.transitionTo(`/store/${storeId}`)
    }

    render () {
        return (
            <form className="store-selector" onSubmit={ (e) => this.goToStore(e) }>
              <h1>Please select store</h1>
              <input type="text" required placeholder="store name"
                     defaultValue={getFunName()} ref={(input) => { this.storeInput = input }}/>
              <button type="submit">Visit store -></button>
            </form>
        )
    }
}

StorePicker.contextTypes = {
    router: React.PropTypes.object
};

export default StorePicker;
