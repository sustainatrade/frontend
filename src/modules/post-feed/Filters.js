import React from 'react';
import './Filters.css';
import { Accordion, Divider, Label, Button, Icon } from 'semantic-ui-react';
import Drawer from 'antd/lib/drawer';
import keyBy from 'lodash/keyBy';
import { sections } from './../../config';
import PostFeedContext from './../../contexts/PostFeedContext';
import { GlobalConsumer } from './../../contexts';
import ContentDropdown from '../create-post/ContentDropdown';
import { contents } from '../../components/widgets';

const FilterTag = ({ color, text, filterKey }) => (
  <div>
    <PostFeedContext.Consumer>
      {({ filterOpened, showFilterDrawer, setFiltersFn }) => {
        if (!filterKey) return <Button as="div" disabled content={text} />;
        return (
          <Button
            as="div"
            labelPosition="left"
            onClick={e => {
              showFilterDrawer(!filterOpened);
            }}
          >
            <Label as="a" basic color={color}>
              {text.toUpperCase()}
            </Label>
            <Button
              icon
              color={color}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                setFiltersFn({ [filterKey]: undefined });
              }}
            >
              <Icon name="x" />
            </Button>
          </Button>
        );
      }}
    </PostFeedContext.Consumer>
  </div>
);

const FilterContent = ({ filterValues }) => (
  <GlobalConsumer>
    {({ category: { categories }, postFeed: { showFilterDrawer }, responsive: { isMobile } }) => {
      let section;
      if (filterValues['section']) {
        const sectionsKeyed = keyBy(sections, 'key');
        section = sectionsKeyed[filterValues['section']];
      }
      let category;
      if (filterValues['category']) {
        category = categories[filterValues['category']];
      }
      let content;
      if (filterValues['content']) {
        content = contents[filterValues['content']];
      }
      return (
        <React.Fragment>
          {Object.keys(filterValues).length === 0 && <FilterTag text="No filters" />}
          {section && <FilterTag filterKey="section" text={section.displayName} color={section.color} />}
          {category && <FilterTag filterKey="category" text={category} />}
          {content && <FilterTag filterKey="content" text={content.name} />}
          {isMobile ? (
            <React.Fragment>
              <div className="mobile-add-filter-filler" />
              <Button
                className="mobile-add-filter"
                icon="filter"
                color="olive"
                onClick={() => showFilterDrawer(true)}
              />
            </React.Fragment>
          ) : (
            <Button
              as="div"
              content={'Add Filter'}
              icon="plus"
              color="olive"
              basic
              labelPosition="right"
              onClick={() => showFilterDrawer(true)}
            />
          )}
        </React.Fragment>
      );
    }}
  </GlobalConsumer>
);

const FilterWrapper = props => (
  <PostFeedContext.Consumer>
    {({ filterActiveIndex, setFilterActiveIndex }) => {
      const { content: Content, defaultActive, index, title, filterKey, filterValues = {} } = props;
      const active = defaultActive || filterActiveIndex === index;
      return (
        <React.Fragment>
          <Accordion.Title
            active={active}
            index={index}
            onClick={e => setFilterActiveIndex(active ? null : index)}
          >
            {!defaultActive && <Icon name="dropdown" />}
            {title}{' '}
            {!!filterValues[filterKey] && (
              <Button size="mini" compact floated="right" onClick={e => e.stopPropagation()}>
                Clear
              </Button>
            )}
          </Accordion.Title>
          <Accordion.Content active={active}>
            <Content {...props} />
          </Accordion.Content>
        </React.Fragment>
      );
    }}
  </PostFeedContext.Consumer>
);

// const CategoryFilter = ({ setFiltersFn, filterValues = {} }) => {
//   return (
//     <CategoryContext.Consumer>
//       {({ categories: catMap, icons }) => {
//         let opts = [];
//         if (catMap)
//           opts = [
//             {
//               key: 'all',
//               text: 'All',
//               value: undefined,
//               icon: 'grid layout'
//             },
//             ...Object.keys(catMap).map(catKey => ({
//               key: catKey,
//               text: catMap[catKey],
//               value: catKey,
//               icon: icons[catKey]
//             }))
//           ];
//         return (
//           <Dropdown
//             placeholder="Category"
//             search
//             fluid
//             selection
//             onChange={(_, data) => {
//               setFiltersFn({ category: data.value });
//             }}
//             options={opts}
//           />
//         );
//       }}
//     </CategoryContext.Consumer>
//   );
// };
const ContentFilter = ({ setFiltersFn, filterValues = {} }) => {
  console.log('filterValues'); //TRACE
  console.log(filterValues); //TRACE
  return (
    <ContentDropdown
      defaultValue={filterValues.content}
      onChange={code => {
        setFiltersFn({ content: code });
      }}
    />
  );
};

export default class Filters extends React.Component {
  state = {
    tmpFilters: null
  };
  defaultFilters = [
    {
      key: 'content',
      title: 'Content',
      defaultActive: true,
      content: ContentFilter
    }
  ];
  setTmpFilters(newFilters) {
    const { tmpFilters: oldFilters } = this.state;
    this.setState({ tmpFilters: { ...oldFilters, ...newFilters } });
  }
  render() {
    const { isMobile } = this.props;
    const filters = [...this.defaultFilters];
    const { tmpFilters } = this.state;
    return (
      <PostFeedContext.Consumer>
        {({ setFiltersFn, filters: currentFilters, filterOpened, showFilterDrawer }) => {
          const filterValues = tmpFilters === null ? currentFilters : tmpFilters;
          return (
            <React.Fragment>
              {isMobile && <Divider style={{ marginTop: 35 }} />}
              <div className={isMobile ? 'filter-menu' : 'filter-desktop'}>
                {isMobile ? (
                  <section className="filter-scroller">
                    <FilterContent filterValues={filterValues} />
                  </section>
                ) : (
                  <FilterContent filterValues={filterValues} />
                )}
              </div>
              <Drawer
                title={
                  <div>
                    <Icon name="filter" />
                    Filters
                  </div>
                }
                width={isMobile ? '100%' : 480}
                placement="right"
                onClose={e => showFilterDrawer(false)}
                visible={filterOpened}
                style={{
                  height: 'calc(100% - 56px)',
                  overflow: 'auto',
                  paddingBottom: 53
                }}
              >
                <Accordion fluid>
                  {filters.map((filter, ii) => (
                    <React.Fragment key={filter.key}>
                      {ii > 0 && <Divider />}
                      <FilterWrapper
                        index={ii}
                        {...filter}
                        filterKey={filter.key}
                        setFiltersFn={e => this.setTmpFilters(e)}
                        filterValues={filterValues}
                      />
                    </React.Fragment>
                  ))}
                </Accordion>
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    borderTop: '1px solid #e8e8e8',
                    padding: '10px 16px',
                    textAlign: 'right',
                    left: 0,
                    background: '#fff',
                    borderRadius: '0 0 4px 4px'
                  }}
                >
                  <Button
                    style={{
                      marginRight: 8
                    }}
                    onClick={e => {
                      this.setState({ tmpFilters: null });
                      showFilterDrawer(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      const { tmpFilters } = this.state;
                      setFiltersFn(tmpFilters);
                      showFilterDrawer(false);
                      this.setState({ tmpFilters: null });
                    }}
                    primary
                  >
                    Apply
                  </Button>
                </div>
              </Drawer>
            </React.Fragment>
          );
        }}
      </PostFeedContext.Consumer>
    );
  }
}
