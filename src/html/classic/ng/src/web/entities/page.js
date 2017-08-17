/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2017 Greenbone Networks GmbH
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 */

import React from 'react';

import {is_defined, exclude_object_props} from 'gmp/utils.js';

import PropTypes from '../utils/proptypes.js';
import {render_section_title} from '../utils/render.js';

import Toolbar from '../components/bar/toolbar.js';

import DashboardControls from '../components/dashboard/controls.js';

import Layout from '../components/layout/layout.js';

import Loading from '../components/loading/loading.js';

import PowerFilter from '../components/powerfilter/powerfilter.js';

import Section from '../components/section/section.js';

const exclude_props = [
  'children',
  'dashboard',
  'filterEditDialog',
  'filters',
  'powerfilter',
  'section',
  'sectionIcon',
  'table',
  'title',
  'toolBarIcons',
];

class EntitiesPage extends React.Component {

  constructor(...args) {
    super(...args);

    this.handleFilterEditClick = this.handleFilterEditClick.bind(this);
  }

  getSectionTitle() {
    let {entities, title} = this.props;

    return render_section_title(entities, title);
  }

  handleFilterEditClick() {
    if (this.filter_dialog) {
      this.filter_dialog.show();
    }
  }

  renderSection() {
    const {
      entities,
      filter,
      foldable,
      loading,
      sectionIcon,
    } = this.props;
    let DashboardComponent = this.props.dashboard;
    let SectionComponent = this.props.section;

    if (SectionComponent === false) {
      return null;
    }

    if (!is_defined(SectionComponent)) {
      SectionComponent = Section;
    }

    return (
      <SectionComponent
        title={this.getSectionTitle()}
        className="entities-section"
        img={sectionIcon}
        foldable={foldable}
        extra={DashboardComponent ? <DashboardControls/> : null}>
        {DashboardComponent &&
          <DashboardComponent filter={filter}/>
        }
        {loading && !is_defined(entities) ?
          this.renderLoading() :
          this.renderTable()
        }
      </SectionComponent>
    );
  }

  renderLoading() {
    const {loading} = this.props;
    return (
      <Loading loading={loading}/>
    );
  }

  renderTable() {
    const {
      filter,
      entities,
      table: TableComponent,
      ...props,
    } = this.props;

    if (!is_defined(entities) || !is_defined(TableComponent)) {
      return null;
    }

    const other = exclude_object_props(props, exclude_props);

    return (
      <TableComponent
        {...other}
        filter={filter}
        entities={entities}
      />
    );
  }

  renderPowerFilter() {
    const {
      filter,
      filterEditDialog,
      filters,
      powerfilter = PowerFilter,
      onFilterChanged,
      onFilterCreateClick,
    } = this.props;

    if (!powerfilter) {
      return null;
    }

    const PowerFilterComponent = powerfilter;

    const handler = is_defined(filterEditDialog) ?
      this.handleFilterEditClick : undefined;

    return (
      <Layout flex
        align="end"
        grow="1">
        <PowerFilterComponent
          filter={filter}
          filters={filters}
          onEditClick={handler}
          onCreateClick={onFilterCreateClick}
          onResetClick={onFilterChanged}
          onUpdate={onFilterChanged}/>
      </Layout>
    );
  }

  renderToolbarIcons() {
    let {toolBarIcons, ...other} = this.props;

    if (!is_defined(toolBarIcons)) {
      return null;
    }

    if (React.isValidElement(toolBarIcons)) {
      return toolBarIcons;
    }
    other = exclude_object_props(other, exclude_props);
    return React.createElement(toolBarIcons, other);
  }

  renderToolbar() {
    return (
      <Toolbar>
        {this.renderToolbarIcons()}
        {this.renderPowerFilter()}
      </Toolbar>
    );
  }

  renderDialogs() {
    const {
      filter,
      onFilterChanged,
    } = this.props;
    let FilterDialogComponent = this.props.filterEditDialog;

    if (!FilterDialogComponent) {
      return null;
    }

    return (
      <FilterDialogComponent
        filter={filter}
        ref={ref => this.filter_dialog = ref}
        onFilterChanged={onFilterChanged}/>
    );
  }

  render() {
    return (
      <div>
        {this.renderToolbar()}
        {this.renderSection()}
        {this.renderDialogs()}
      </div>
    );
  }
}

EntitiesPage.propTypes = {
  dashboard: PropTypes.componentOrFalse,
  entities: PropTypes.collection,
  foldable: PropTypes.bool,
  filterEditDialog: PropTypes.component,
  filter: PropTypes.filter,
  filters: PropTypes.arrayLike,
  loading: PropTypes.bool,
  powerfilter: PropTypes.componentOrFalse,
  sectionIcon: PropTypes.icon,
  section: PropTypes.componentOrFalse,
  table: PropTypes.componentOrFalse,
  title: PropTypes.string,
  toolBarIcons: PropTypes.componentOrElement,
  onFilterChanged: PropTypes.func,
  onFilterCreateClick: PropTypes.func,
};

export const createEntitiesPage = (options = {}) => {
  const EntitiesPageWrapper = props => {
    return (
      <EntitiesPage {...options} {...props}/>
    );
  };
  return EntitiesPageWrapper;
};

export default EntitiesPage;

// vim: set ts=2 sw=2 tw=80:
