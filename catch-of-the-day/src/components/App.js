import React from 'react';
import Header from './Header'
import Order from './Order'
import Inventory from './Inventory'
import sampleFishes from '../sample-fishes'
import Fish from './Fish'
import base from '../base';



class App extends React.Component {
    constructor () {
        super();
        this.addFish = this.addFish.bind(this);
        this.updateFish = this.updateFish.bind(this);
        this.removeFish = this.removeFish.bind(this);
        this.loadSampleFishes = this.loadSampleFishes.bind(this);
        this.addToOrder = this.addToOrder.bind(this);
        this.removeFromOrder = this.removeFromOrder.bind(this);
        // Getinitialstate
        this.state = {
            fishes: {},
            orders: {}
        };
    }

    componentWillMount(){
        this.ref = base.syncState(`${this.props.params.storeId}/fishes`
                                , {
                                    context: this,
                                    state: 'fishes'
                                });

        const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);
        if(localStorageRef) {
            this.setState(
                {
                    orders: JSON.parse(localStorageRef)
                });
        }
    }

    componentWillUnmount(){
        base.removeBinding(this.ref);
    }

    componentWillUpdate(nextProps, nextState) {
        localStorage.setItem(`order-${this.props.params.storeId}`,
                             JSON.stringify(nextState.orders));

    }

    addFish(fish) {
        const fishes = {...this.state.fishes};
        const timestamp = Date.now();
        fishes[`fish-${timestamp}`] = fish;
        this.setState( {fishes} );
    }

    removeFish(key) {
        const fishes = {...this.state.fishes};
        fishes[key] = null;
        this.setState( {fishes} );
    }

    updateFish(key, updatedFish){
        const fishes = {...this.state.fishes};
        fishes[key] = updatedFish;
        this.setState( {fishes} );
    }

    loadSampleFishes() {
        this.setState({fishes: sampleFishes})
    }

    addToOrder(key) {
        const orders = {...this.state.orders};
        orders[key] = orders[key] + 1 || 1;
        this.setState({ orders });
    }

    removeFromOrder(key) {
        const orders = {...this.state.orders};
        delete orders[key];
        this.setState({ orders });
    }

    render () {
        return (
            <div className="catch-of-the-day">
            <div className="menu">
            <Header tagline="Fresh Seafood Market"/>
            <ul className="list-of-fishes">
            {
                Object
                    .keys(this.state.fishes)
                    .map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />)
            }
            </ul>
            </div>

            <Order
            fishes={this.state.fishes}
            order={this.state.orders}
            removeFromOrder={this.removeFromOrder}
            params={this.state.params}
            />

            <Inventory
            updateFish={this.updateFish}
            addFish={this.addFish}
            removeFish={this.removeFish}
            loadSampleFishes={this.loadSampleFishes}
            fishes={this.state.fishes}
            storeId={this.props.params.storeId}
            />
            </div>
        )
    }
}


App.propTypes = {
    params: React.PropTypes.object.isRequired
};

export default App
