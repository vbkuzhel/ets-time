import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Actions
import {
  toggleTrackFilters,
  getTracks,
  setTrackFilters
} from './../../store/actions/trackActions';

// Helpers
import { getInitFilters } from './../../shared/HelpService';

class Filters extends React.Component {
  state = getInitFilters();

  componentDidMount() {
    this.setState(this.props.filters);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.filters);
  }

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleChangeStartDate = date => {
    this.setState({ startDate: date });
  };

  handleChangeEndDate = date => {
    this.setState({ endDate: date });
  };

  handleClose = () => {
    this.props.toggleTrackFilters();
  };

  handleUseFilters = () => {
    let filters = this.state;
    this.props.toggleTrackFilters();
    this.props.setTrackFilters(filters);
    this.props.getTracks(filters);
  };

  render() {
    const workTypes = this.props.workTypes.map((item, i) =>
      <option key={i} value={item}>{item}</option>
    );

    const statusTypes = this.props.statusTypes.map((item, i) =>
      <option key={i} value={item}>{item}</option>
    );

    return (
      <div
        className={classnames('sidebar', {
          'sidebar--open': this.props.filtersIsOpen
        })}
      >
        <div className="sidebar__wrapper">
          <h4 className="sidebar__title">Change filters</h4>

          <label className="filters__headline">Project</label>
          <input
            type="text"
            value={this.state.project}
            name="project"
            onChange={this.handleInputChange}
            className="filters__input"
          />

          <label className="filters__headline">Task</label>
          <input
            type="text"
            value={this.state.task}
            name="task"
            onChange={this.handleInputChange}
            className="filters__input"
          />

          <label className="filters__headline">Work type</label>
          <select
            name="workType"
            className="filters__select"
            value={this.state.workType}
            onChange={this.handleInputChange}
          >
            <option value="" />
            {workTypes}
          </select>

          <label className="filters__headline">Status</label>
          <select
            name="status"
            className="filters__select"
            value={this.state.status}
            onChange={this.handleInputChange}
          >
            <option value="" />
            {statusTypes}
          </select>

          <label className="filters__headline">Start date</label>
          <DatePicker
            dateFormat="DD-MM-YYYY"
            selected={this.state.startDate}
            onChange={this.handleChangeStartDate}
            className="filters__select"
          />

          <label className="filters__headline">End date</label>
          <DatePicker
            dateFormat="DD-MM-YYYY"
            selected={this.state.endDate}
            onChange={this.handleEndChange}
            className="filters__select"
          />
        </div>
        <div className="sidebarBtns">
          <button
            className="sidebarBtns__btn sidebarBtns__btn--save"
            onClick={this.handleUseFilters}
          >
            Apply filters
          </button>
          <button
            className="sidebarBtns__btn sidebarBtns__btn--cancel"
            onClick={this.handleClose}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    filtersIsOpen: state.trackReducer.filtersIsOpen,
    workTypes: state.trackReducer.workTypes,
    statusTypes: state.trackReducer.statusTypes,
    filters: state.trackReducer.filters
  };
}

export default connect(mapStateToProps, {
  toggleTrackFilters,
  getTracks,
  setTrackFilters
})(Filters);