<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\SalaController;
use App\Http\Controllers\AtivoController;
use App\Http\Controllers\FuncionarioController;
use App\Http\Controllers\UnidadeController;
use App\Http\Controllers\LocacaoController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/contato', function () {
    return Inertia::render('Contato'); // Bate direto no arquivo Contato.jsx
})->name('contato');

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Sala
    Route::get('/salas', [SalaController::class, 'index'])->name('salas.index');
    Route::post('/salas', [SalaController::class, 'store'])->name('salas.store');
    Route::get('/salas', [SalaController::class, 'index'])->name('salas.index');
    Route::post('/salas', [SalaController::class, 'store'])->name('salas.store');
    Route::put('/salas/{sala}', [SalaController::class, 'update'])->name('salas.update');
    Route::delete('/salas/{sala}', [SalaController::class, 'destroy'])->name('salas.destroy');



    // Ativos:
    Route::get('/ativos', [AtivoController::class, 'index'])->name('ativos.index');
    Route::post('/ativos', [AtivoController::class, 'store'])->name('ativos.store');
    Route::put('/ativos/{ativo}', [AtivoController::class, 'update'])->name('ativos.update');
    Route::delete('/ativos/{ativo}', [AtivoController::class, 'destroy'])->name('ativos.destroy');


    // Funcionarios
    Route::get('/funcionarios', [FuncionarioController::class, 'index'])->name('funcionarios.index');
    Route::post('/funcionarios', [FuncionarioController::class, 'store'])->name('funcionarios.store');
    Route::delete('/funcionarios/{funcionario}', [FuncionarioController::class, 'destroy'])->name('funcionarios.destroy');
    Route::resource('funcionarios', FuncionarioController::class);


    // unidades
    Route::get('/unidades', [UnidadeController::class, 'index'])->name('unidades.index');
    Route::post('/unidades', [UnidadeController::class, 'store'])->name('unidades.store');
    Route::resource('unidades', UnidadeController::class);



    // Locação de sala
    Route::get('/locacoes', [LocacaoController::class, 'index'])->name('locacoes.index');
    Route::post('/locacoes', [LocacaoController::class, 'store'])->name('locacoes.store');
    Route::put('/locacoes/{locacao}', [LocacaoController::class, 'update'])->name('locacoes.update');
    Route::delete('/locacoes/{locacao}', [LocacaoController::class, 'destroy'])->name('locacoes.destroy');


    //Verificar Sala ocupada na locação
    Route::get('/locacoes/verificar-periodos', [LocacaoController::class, 'verificarPeriodosOcupados'])->name('locacoes.verificar');
    Route::resource('locacoes', LocacaoController::class);
});


require __DIR__ . '/auth.php';
