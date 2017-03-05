import React from 'react';
import AddFishForm from './AddFishForm'
import base from '../base'

class Inventory extends React.Component {
    constructor () {
        super();
        this.renderInventory = this.renderInventory.bind(this);
        this.renderLogin = this.renderLogin.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.authenticateHandler = this.authenticateHandler.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.logout = this.logout.bind(this);
        this.state = {
            uid: null,
            owner: null
        }
    }

    componentDidMount() {
        base.onAuth( (user) => {
            if(user) {
                this.authenticateHandler(null, { user });
            }
        });
    }

    handleChange(e, key){
        const fish = this.props.fishes[key];
        const updatedFish = {
            ...fish,
            [e.target.name]: e.target.value
        }
        this.props.updateFish(key, updatedFish);
    }

    authenticateHandler(err, authData){
        if(err){
            console.log(err);
            return;
        }

        // Grab the store info
        const storeRef = base.database().ref(this.props.storeId);

        storeRef.once('value', (snapshot) => {
            const data = snapshot.val() || {};
            // Claim store if it's not owned by anyone
            if(!data.owner) {
                storeRef.set({
                    owner: authData.user.uid
                });
            }

            this.setState({
                uid: authData.user.uid,
                owner: data.owner || authData.user.uid
            })
        });
    }

    logout() {
        base.unauth();
        this.setState({ uid: null});
    }

    authenticate(provider){
        base.authWithOAuthPopup(provider, this.authenticateHandler)
    }

    renderLogin(){
        return (
            <nav className="login">
                <h2>Inventory</h2>
                <p>Sign in to manage your store's inventory</p>
                <button className="github" onClick={() => this.authenticate('github')}>Log in with Github</button>
                <button className="facebook" onClick={() => this.authenticate('facebook')}>Log in with facebook</button>
                <button className="twitter" onClick={() => this.authenticate('twitter')}>Log in with Twitter</button>
            </nav>
        )
    }

    renderInventory(key) {
        const fish = this.props.fishes[key];
        return (
            <div className="fish-edit" key={key}>
                <input name="name" type="text" value={fish.name} placeholder="Fish Name" onChange={(e) => this.handleChange(e, key)}/>
                <input name="price" type="text" value={fish.price} placeholder="Fish price" onChange={(e) => this.handleChange(e, key)}/>
                <select name="status" type="text" value={fish.status} placeholder="Fish status" onChange={(e) => this.handleChange(e, key)}>
                    <option value="available">Fresh!</option>
                    <option value="unavailable">Sold out!</option>
                </select>
                <textarea name="desc" type="text" value={fish.desc} placeholder="Fish desc" onChange={(e) => this.handleChange(e, key)}>
                </textarea>
                <input name="image" type="text" value={fish.image} placeholder="Fish image" onChange={(e) => this.handleChange(e, key)}/>
                <button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
            </div>
        )
    }

    render () {
        const logout = <button onClick={this.logout}>Log out!</button>;
        if (!this.state.uid){
            return (
                <div>{this.renderLogin()}</div>
            )
        }

        if (this.state.uid !== this.state.owner) {
            return (
                <div>
                    <p>Sorry, you are not the owner of this store 🙍</p>
                    {logout}
                </div>
            )
        }

        return (
            <div>
                <h2>Inventory</h2>
                {logout}
                {Object.keys(this.props.fishes).map(this.renderInventory)}
                <AddFishForm addFish={this.props.addFish} />
                <button onClick={this.props.loadSampleFishes}>Load sample fishes</button>
            </div>
        )
    }
}

Inventory.propTypes = {
    fishes: React.PropTypes.object.isRequired,
    updateFish: React.PropTypes.func.isRequired,
    removeFish: React.PropTypes.func.isRequired,
    addFish: React.PropTypes.func.isRequired,
    loadSampleFishes: React.PropTypes.func.isRequired,
    storeId: React.PropTypes.string.isRequired,
}


export default Inventory;
