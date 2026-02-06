<?php
header('Content-Type: application/json');
require_once 'config.php';

// Obtener método y acción (si aplica)
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

// --- FUNCIONES HELPERS ---
function generateUuid()
{
    return sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff)
    );
}

// --- ROUTING MANUAL ---

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    // 1. CREAR INVITACIÓN (Solo Admin)
    if ($action === 'create') {
        if (!isset($input['guests']) || !is_array($input['guests'])) {
            echo json_encode(['error' => 'Lista de invitados requerida']);
            exit;
        }

        $uuid = generateUuid();

        try {
            $pdo->beginTransaction();

            // Insertar invitación
            $stmt = $pdo->prepare("INSERT INTO invitations (uuid, status) VALUES (?, 'pending')");
            $stmt->execute([$uuid]);
            $invitationId = $pdo->lastInsertId();

            // Insertar invitados
            $stmtGuest = $pdo->prepare("INSERT INTO guests (invitation_id, name) VALUES (?, ?)");
            foreach ($input['guests'] as $guestName) {
                $stmtGuest->execute([$invitationId, trim($guestName)]);
            }

            $pdo->commit();
            echo json_encode(['success' => true, 'uuid' => $uuid, 'link' => "?id=" . $uuid]);

        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    // 2. RSVP (Confirmar/Rechazar) - Invitado
    elseif ($action === 'rsvp') {
        if (!isset($input['uuid'])) {
            echo json_encode(['error' => 'UUID requerido']);
            exit;
        }

        $uuid = $input['uuid'];
        $attendingIds = isset($input['attending_ids']) ? $input['attending_ids'] : []; // Array de IDs de guests que van
        $isDeclining = isset($input['decline']) && $input['decline'] === true; // Si rechazan todo
        $message = isset($input['message']) ? $input['message'] : '';

        try {
            // Obtener ID de invitación
            $stmt = $pdo->prepare("SELECT id FROM invitations WHERE uuid = ?");
            $stmt->execute([$uuid]);
            $inv = $stmt->fetch();

            if (!$inv) {
                echo json_encode(['error' => 'Invitación no encontrada']);
                exit;
            }

            $pdo->beginTransaction();

            // Actualizar mensaje y estado global
            $finalStatus = $isDeclining ? 'declined' : 'confirmed';
            $updateInv = $pdo->prepare("UPDATE invitations SET status = ?, message = ? WHERE id = ?");
            $updateInv->execute([$finalStatus, $message, $inv['id']]);

            // Resetear asistencia de todos primero (por si están editando)
            $resetGuests = $pdo->prepare("UPDATE guests SET is_attending = 0 WHERE invitation_id = ?");
            $resetGuests->execute([$inv['id']]);

            // Marcar los que asisten
            if (!$isDeclining && !empty($attendingIds)) {
                // Validar que los IDs pertenezcan a esa invitación para seguridad
                $inQuery = implode(',', array_fill(0, count($attendingIds), '?'));
                // Merge params: attendingIds + invitationId
                $params = $attendingIds;
                $params[] = $inv['id'];

                $updateGuests = $pdo->prepare("UPDATE guests SET is_attending = 1 WHERE id IN ($inQuery) AND invitation_id = ?");
                $updateGuests->execute($params);
            }

            $pdo->commit();
            echo json_encode(['success' => true]);

        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
} elseif ($method === 'GET') {

    // 3. OBTENER INFO DE INVITADO (Frontend)
    if ($action === 'get_guest') {
        if (!isset($_GET['uuid'])) {
            echo json_encode(['error' => 'UUID requerido']);
            exit;
        }

        $uuid = $_GET['uuid'];

        $stmt = $pdo->prepare("SELECT * FROM invitations WHERE uuid = ?");
        $stmt->execute([$uuid]);
        $invitation = $stmt->fetch();

        if ($invitation) {
            $stmtGuests = $pdo->prepare("SELECT id, name, is_attending FROM guests WHERE invitation_id = ?");
            $stmtGuests->execute([$invitation['id']]);
            $guests = $stmtGuests->fetchAll();

            echo json_encode([
                'found' => true,
                'invitation' => $invitation,
                'guests' => $guests
            ]);
        } else {
            echo json_encode(['found' => false]);
        }
    }

    // 4. LISTAR TODOS (Admin Dashboard)
    elseif ($action === 'list') {
        // En una app real, verificar sesión de admin aquí.

        // Obtener todas las invitaciones con sus invitados concatenados
        $query = "
            SELECT 
                i.id, i.uuid, i.status, i.message,
                GROUP_CONCAT(g.name SEPARATOR ', ') as guest_names,
                SUM(g.is_attending) as attending_count,
                COUNT(g.id) as total_guests
            FROM invitations i
            LEFT JOIN guests g ON i.id = g.invitation_id
            GROUP BY i.id
            ORDER BY i.created_at DESC
        ";

        $stmt = $pdo->query($query);
        $invitations = $stmt->fetchAll();

        // Calcular estadísticas globales
        $statsQuery = "
            SELECT 
                (SELECT COUNT(*) FROM guests WHERE is_attending = 1) as total_attending,
                (SELECT COUNT(*) FROM guests) as total_invited,
                (SELECT COUNT(*) FROM invitations WHERE status = 'declined') as total_declined_invitations,
                (SELECT COUNT(*) FROM invitations WHERE status = 'pending') as total_pending_invitations
            FROM DUAL
        ";
        $stats = $pdo->query($statsQuery)->fetch();

        echo json_encode([
            'invitations' => $invitations,
            'stats' => $stats
        ]);
    }
}
?>