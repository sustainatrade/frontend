Default:

```js

const { Dropdown } = require('semantic-ui-react');

<App>
    <App.Header appName="PY Procurement">
        <App.Header.Menu position="right">
            <Dropdown item text='Language'>
                <Dropdown.Menu>
                    <Dropdown.Item>English</Dropdown.Item>
                    <Dropdown.Item>Russian</Dropdown.Item>
                    <Dropdown.Item>Spanish</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </App.Header.Menu>
    </App.Header>
    <App.Content >xxx</App.Content>
    Push Me
</App>
```

As Module:

```js

const { Dropdown, Menu, Icon } = require('semantic-ui-react');

<App>
    <App.Header appName="PY Procurement" module>
        <App.Header.MenuItem position="left" name='grid layout'>
            <Icon name='grid layout' />
        </App.Header.MenuItem>
        <App.Header.MenuItem position="right" >
            <Icon name='bell' />
        </App.Header.MenuItem>
        <App.Header.Menu position="right">
            <Dropdown item text='Language'>
                <Dropdown.Menu>
                    <Dropdown.Item>English</Dropdown.Item>
                    <Dropdown.Item>Russian</Dropdown.Item>
                    <Dropdown.Item>Spanish</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </App.Header.Menu>
    </App.Header>
    <App.Content >xxx</App.Content>
    Push Me
</App>
```