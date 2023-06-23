import React from 'react';
import { shallow, mount } from 'enzyme';
import { TabContent, TabPane } from '..';
var activeTab = '1';
describe('Tabs', function () {
  it('should render', function () {
    activeTab = '1';
    var tab1 = mount( /*#__PURE__*/React.createElement(TabContent, {
      activeTab: activeTab
    }, /*#__PURE__*/React.createElement(TabPane, {
      tabId: "1"
    }, "Tab Content 1"), /*#__PURE__*/React.createElement(TabPane, {
      tabId: "2"
    }, "TabContent 2")));
    expect(tab1.find('.tab-content').hostNodes().length).toBe(1);
    expect(tab1.find('.tab-pane').hostNodes().length).toBe(2);
  });
  it('should have tab1 as active', function () {
    activeTab = '1';
    var tab1 = mount( /*#__PURE__*/React.createElement(TabContent, {
      activeTab: activeTab
    }, /*#__PURE__*/React.createElement(TabPane, {
      tabId: "1"
    }, "Tab Content 1"), /*#__PURE__*/React.createElement(TabPane, {
      tabId: "2"
    }, "TabContent 2")));
    expect(tab1.find('.tab-content .tab-pane').hostNodes().at(0).hasClass('active')).toBe(true);
  });
  it('should switch to tab2 as active when clicked', function () {
    activeTab = '2';
    var tab1 = mount( /*#__PURE__*/React.createElement(TabContent, {
      activeTab: activeTab
    }, /*#__PURE__*/React.createElement(TabPane, {
      tabId: "1"
    }, "Tab Content 1"), /*#__PURE__*/React.createElement(TabPane, {
      tabId: "2"
    }, "TabContent 2")));
    expect(tab1.find('.tab-content .tab-pane').hostNodes().at(1).hasClass('active')).toBe(true);
  });
  it('should not setState when the active tab does not change during a prop update', function () {
    var tab1 = mount( /*#__PURE__*/React.createElement(TabContent, {
      activeTab: 1
    }));
    var instance = tab1.instance();
    jest.spyOn(instance, 'setState');
    tab1.setProps({
      style: {
        textAlign: 'left'
      }
    });
    expect(instance.setState).not.toHaveBeenCalled();
  });
  it('should show no active tabs if active tab id is unknown', function () {
    activeTab = '3';
    var tab1 = mount( /*#__PURE__*/React.createElement(TabContent, {
      activeTab: activeTab
    }, /*#__PURE__*/React.createElement(TabPane, {
      tabId: "1"
    }, "Tab Content 1"), /*#__PURE__*/React.createElement(TabPane, {
      tabId: "2"
    }, "TabContent 2")));
    /* Not sure if this is what we want. Toggling to an unknown tab id should
      render all tabs as inactive and should show no content.
      This could be a warning during development that the user is not having a proper tab ids.
      NOTE: Should this be different?
    */
    expect(tab1.find('.tab-content .tab-pane').hostNodes().at(0).hasClass('active')).toBe(false);
    expect(tab1.find('.tab-content .tab-pane').hostNodes().at(1).hasClass('active')).toBe(false);
  });
  it('should call setState when the active tab does change during a prop update', function () {
    var tab1 = mount( /*#__PURE__*/React.createElement(TabContent, {
      activeTab: 1
    }));
    expect(tab1.state().activeTab).toEqual(1);
    tab1.setProps({
      activeTab: 2
    });
    expect(tab1.state().activeTab).toEqual(2);
  });
  it('should render custom TabContent tag', function () {
    var wrapper = shallow( /*#__PURE__*/React.createElement(TabContent, {
      tag: "main",
      activeTab: activeTab
    }, /*#__PURE__*/React.createElement(TabPane, {
      tabId: "1"
    }, "Tab Content 1"), /*#__PURE__*/React.createElement(TabPane, {
      tabId: "2"
    }, "TabContent 2")));
    expect(wrapper.childAt(0).type()).toBe('main');
  });
  it('should render custom TabPane tag', function () {
    var wrapper = mount( /*#__PURE__*/React.createElement(TabPane, {
      tag: "main",
      tabId: "1"
    }, "Tab Content 1"), {
      context: {}
    });
    expect(wrapper.childAt(0).type()).toBe('main');
  });
});