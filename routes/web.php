<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Route::statamic('example', 'example-view', [
//    'title' => 'Example'
// ]);


Route::statamic('search', 'search');

Route::redirect('contact', 'projecten/contact');
Route::redirect('alleedukaai', 'projecten/alleedukaai');
Route::redirect('biestebroekbis', 'projecten/biestebroekbis');
Route::redirect('in-limbo', 'projecten/in-limbo');
Route::redirect('marie-moskou', 'projecten/afgelopen-projecten/marie-moskou');

Route::permanentRedirect('biestebroekbis', 'projecten/biestebroekbis');
Route::permanentRedirect('biestebroekbisnl', 'projecten/biestebroekbis');
Route::permanentRedirect('biestebroekbisfr', 'fr/projets/biestebroekbis');
Route::permanentRedirect('biestebroekbisen', 'en/projects/biestebroekbis');
Route::permanentRedirect('alleedukaainl', 'projecten/alleedukaai');
Route::permanentRedirect('alleedukaaifr', 'fr/projets/alleedukaai');
Route::permanentRedirect('alleedukaai/fr', 'fr/projets/alleedukaai');
Route::permanentRedirect('alleedukaaien', 'en/projects/alleedukaai');
Route::permanentRedirect('leegstondfr', 'fr/leegstond');
Route::permanentRedirect('leegstonden', 'en/leegstond');
Route::permanentRedirect('leegstondnl', 'leegstond');