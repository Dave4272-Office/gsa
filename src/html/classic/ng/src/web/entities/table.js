/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2016 - 2017 Greenbone Networks GmbH
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

import _ from '../../locale.js';
import {is_defined, map, exclude, includes} from '../../utils.js';

import FootNote from '../footnote.js';
import Layout from '../layout.js';
import Pagination from '../pagination.js';
import PropTypes from '../proptypes.js';

import StrippedTable from '../table/stripped.js';

const exclude_props = [
  'row',
  'header',
  'footer',
  'pagination',
  'emptyTitle',
  'children',
];

export class EntitiesTable extends React.Component {

  render() {
    let {props} = this;
    let {filter, entities, emptyTitle} = props;

    let RowComponent = props.row;
    let HeaderComponent = props.header;
    let FooterComponent = props.footer;
    let PaginationComponent = is_defined(props.pagination) ?
      props.pagination : Pagination;

    const other = exclude(props, key => includes(exclude_props, key));

    let filterstring = filter ? filter.toFilterString() : '';

    if (!is_defined(entities)) {
      return <div className="entities-table">{_('Loading')}</div>;
    }

    if (entities.length === 0) {
      return <div className="entities-table">{emptyTitle}</div>;
    }

    let rows;
    if (RowComponent) {
      rows = map(entities, entity => {
        return (
          <RowComponent {...other} key={entity.id}
            entity={entity}/>
        );
      });
    }

    let pagination;
    if (PaginationComponent) {
      pagination = (
        <PaginationComponent
          {...other}
          counts={entities.getCounts()}/>
      );
    }

    let header;
    if (HeaderComponent) {
      header = (
        <HeaderComponent {...other}/>
      );
    }

    let footer;
    if (FooterComponent) {
      footer = (
        <FooterComponent {...other}/>
      );
    }

    return (
      <div className="entities-table">
        {pagination}
        <StrippedTable header={header} footer={footer}>
          {rows}
        </StrippedTable>
        <Layout flex align="space-between">
          <FootNote>
            {_('(Applied filter: {{filter}})', {filter: filterstring})}
          </FootNote>
          {pagination}
        </Layout>
      </div>
    );
  }
}

EntitiesTable.propTypes = {
  emptyTitle: React.PropTypes.string,
  header: PropTypes.component,
  footer: PropTypes.component,
  row: PropTypes.component.isRequired,
  pagination: PropTypes.componentOrFalse,
  filter: React.PropTypes.object,
  entities: React.PropTypes.object,
  onFirstClick: React.PropTypes.func,
  onLastClick: React.PropTypes.func,
  onPreviousClick: React.PropTypes.func,
  onNextClick: React.PropTypes.func,
  onSortChange: React.PropTypes.func,
};

export const createEntitiesTable = (options = {}) => {

  const EntitiesTableWrapper = props => {
    return <EntitiesTable {...options} {...props}/>;
  };

  return EntitiesTableWrapper;
};


export default EntitiesTable;

// vim: set ts=2 sw=2 tw=80:
