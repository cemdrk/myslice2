import React from 'react';

import actions from '../../actions/dialogs/SelectResource';
import store from '../../stores/dialogs/SelectResource';

import Dialog from '../base/Dialog';
import DialogPanel from '../base/DialogPanel';
import DialogHeader from '../base/DialogHeader';
import DialogFooter from '../base/DialogFooter';
import DialogBody from '../base/DialogBody';
import Title from '../base/Title';
import Text from '../base/Text';
import DateTime from '../base/DateTime';
import List from '../base/List';
import InputText from '../InputText'
import ResourceList from '../objects/ResourceList';
import ResourceElement from '../objects/ResourceElement';

class SelectResourceDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = store.getState();
        this.onChange = this.onChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    componentDidMount() {
        store.listen(this.onChange);
        actions.fetchResources(this.props.testbed);
    }

    componentWillUnmount() {
        store.unlisten(this.onChange);
    }

    onChange(state) {
        this.setState(state);
    }
    handleSubmit(event) {


        actions.updateFilter(this.state.value);
    }
    handleFilter(value) {
        //var f = {'email':value,'shortname':value}
        //actions.updateFilteredUsers();
        //

        //For the text filter
       // console.log( value);
        actions.updateFilter(value);
    }

    /* fetch the users list */
    fetchUsers(filter={}) {
        switch (this.props.from){
            case 'authority':
                actions.fetchFromAuthority(filter);
                break;
            default:
                actions.fetchUsers(filter);
        }
    }

    selectResource(element) {
        actions.selectResource(element);
    }

    handleStartDateChange(e) {
       actions.updateStartDate(e.target.value);
    }
    isSelected(resource) {
        //console.log(this.state.selected);
        /* TOFIX
        this.state.selected.find((el) => {
            return el.id === resource.id;
        })
        */
    }

    handleChange(event) {
        this.setState({value: event.target.value});
        //the event updates the state

    }
    applyChanges() {

    }

    renderSelectedStatus() {
        if (this.state.selected.length > 0) {
            return <div>
                You have selected <a>{this.state.selected.length} resource{this.state.selected.length > 1 ? "s":"" }</a>
            </div>;
        }
    }

    render() {
        // if(Object.keys(this.state.filter).length>0){
        //     var usersList = <UsersList users={this.state.filteredUsers} addUser={this.props.addUser} />
        // }else{
        //     var usersList = <UsersList users={this.state.users} addUser={this.props.addUser} />
        // }

        var dis=[];
        //var selectedOption = this.props.selected;
        var optionLocation = this.state.resources.map(function(res,index) {
            //if (!((res.location.city) in dis))
            if(dis.indexOf(res.location.city) < 0)
                {dis.push(res.location.city);
                  return (<option key={res.id} value={res.location.city} >{res.location.city}</option>);
                 }
        });
         var reservation= null;



         switch(this.props.testbed.name) {
            case 'FIT IoT-Lab':
                reservation =
                        <div className="p-view-body">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div id="resourceReservation-form">
                                            <form className="experimentForm"  >
                                                Configure your experiment :<br/>
                                                Start date: <input type="date" placeholder="yyyy-mm-dd" value={this.state.start_date} onChange={this.handleStartDateChange} />
                                                Time:  <input type="time" placeholder="hh:mm"/>
                                                <br/>
                                                Duration:<select>
                                                              <option value="10 min">10 min</option>
                                                              <option value="15 min">15 min </option>
                                                              <option value="30 min ">30 min</option>
                                                              <option value="1 h">1 h</option>
                                                              <option value="2 h">2 h</option>
                                                              <option value="4 h">4 h</option>
                                                              <option value="8 h">8 h</option>
                                                              <option value="24 h">24 h</option>
                                                          </select>
                                                <br/>
                                                Choose your nodes :
                                                <br/>
                                                Type : <ul className="nav nav-pills">
                                                            <li className="active"><a href="#">M3</a></li>
                                                            <li><a href="#">A8</a></li>
                                                            <li><a href="#">WSN430</a></li>

                                                       </ul>
                                                <br/>

                                                Site : <select  value={this.state.value} onChange={this.handleChange} >
                                                            {optionLocation}
                                                       </select>

                                            </form>
                                            <button onClick={this.handleSubmit}>Search</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                break;
        }
        return (
            <Dialog close={this.props.close}>
                <DialogPanel>
                    <DialogHeader>
                        <Title title={this.props.testbed.name} />
                    </DialogHeader>

                    <DialogBody>

                        {reservation}


                        <InputText name="filter" handleChange={this.handleFilter} placeholder="Filter" />
                        <List>
                        {
                            this.state.resources.map(function(resource) {

                                return <ResourceElement key={resource.id}
                                                        resource={resource}
                                                        handleClick={() => this.selectResource(resource)} />;
                            }.bind(this))
                        }
                        </List>
                        <ResourceList resources={this.state.resources}
                                      selected={this.state.selected}
                                      handleClick={(element) => this.selectResource(element)} />
                    </DialogBody>
                    <DialogFooter>
                        {this.renderSelectedStatus()}
                        <button className="cancel" onClick={this.cancel} >
                            Cancel
                        </button>
                        <button className="apply" onClick={this.applyChanges} >
                            Apply
                        </button>
                    </DialogFooter>
                </DialogPanel>
            </Dialog>
        );
    }
}

SelectResourceDialog.propTypes = {
    testbed: React.PropTypes.object.isRequired,
    close: React.PropTypes.func.isRequired,

};

SelectResourceDialog.defaultProps = {

};

export default SelectResourceDialog;
