<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Sites
    |--------------------------------------------------------------------------
    |
    | Each site should have root URL that is either relative or absolute. Sites
    | are typically used for localization (eg. English/French) but may also
    | be used for related content (eg. different franchise locations).
    |
    */

    'sites' => [
        'default' => [
            'name' => 'nl',
            'locale' => 'nl_BE',
            'url' => '/',
        ],
        'fr' => [
            'name' => 'fr',
            'locale' => 'fr_BE',
            'url' => '/fr'
        ],
        'en' => [
            'name' => 'en',
            'locale' => 'en_US',
            'url' => '/en'
        ],
    ],
];
